import { GoogleGenAI, FunctionDeclaration, Type, Chat } from "@google/genai";
import { Product, InventoryStatus, UserProfile } from "../types";
import { MOCK_PRODUCTS, MOCK_INVENTORY, MOCK_USERS, MOCK_PROMOTIONS } from "../constants";

// --- Worker Agent Implementations ---

export const recommendationWorker = (category?: string, query?: string): Product[] => {
  let results = MOCK_PRODUCTS;
  
  if (category) {
    results = results.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.tags.some(t => t.includes(q)) ||
      Object.values(p.attributes).some(attr => 
        typeof attr === 'string' && attr.toLowerCase().includes(q)
      )
    );
  }

  // Fallback Logic: Check Inventory
  results.forEach(product => {
      const stock = MOCK_INVENTORY[product.sku];
      // Simulate checking "online" stock. If 0, try to find a similar item.
      if (stock && stock.online === 0) {
          // This product is OOS. 
          // In a real app, we would replace it. For this demo, we'll just flag it or leave it
          // relying on the inventory check tool to catch it later.
      }
  });

  return results;
};

export const inventoryWorker = (sku: string): InventoryStatus | null => {
  return MOCK_INVENTORY[sku] || null;
};

export const loyaltyWorker = (userId: string) => {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return null;

  // Find eligible promotions
  const eligiblePromos = MOCK_PROMOTIONS.filter(p => 
    p.tiers.includes(user.loyalty_tier)
  );

  return { 
    tier: user.loyalty_tier, 
    purchaseHistory: user.purchase_history,
    preferences: user.preferences,
    eligiblePromotions: eligiblePromos
  };
};

export const paymentWorker = (amount: number, method: string, userId?: string, skus?: string[]) => {
    // 1. Inventory Reservation (Simulated)
    // 2. Loyalty Calculation (Simulated)
    
    // 3. Payment Processing
    // If the method is "UI_GATEWAY", we return a signal to the frontend to open the modal.
    if (method === 'UI_GATEWAY') {
        return { 
            status: 'action_required', 
            action: 'open_payment_modal',
            details: { amount, userId, skus }
        };
    }

    // Mock automatic processing (e.g. Card on file)
    if (method.toLowerCase().includes('card') && Math.random() < 0.1) {
        return { status: 'declined', reason: 'cvv_failure', recommendation: 'retry_with_cvv' };
    }
    
    // 4. Fulfillment Trigger (Simulated atomic transaction)
    return { 
        status: 'authorized', 
        transactionId: `TXN-${Date.now()}`,
        fulfillmentScheduled: true 
    };
};

export const fulfillmentWorker = (type: string, location: string) => {
    // 5. Post-Purchase Handover
    const trackingId = `TRK-${Math.floor(Math.random() * 900000)}`;
    return { 
        confirmation: `ORD-${Math.floor(Math.random() * 90000) + 10000}`, 
        eta: '24-48 hours',
        trackingId: trackingId,
        supportAgentNotified: true
    };
};

// --- Tool Definitions for Gemini ---

const getRecommendationsTool: FunctionDeclaration = {
  name: "get_recommendations",
  description: "Consult the Recommendation Agent to find products based on category or search query.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, description: "Product category (e.g., Footwear, Electronics)" },
      query: { type: Type.STRING, description: "Search keywords (style, color, occasion)" },
    },
  },
};

const checkInventoryTool: FunctionDeclaration = {
  name: "check_inventory",
  description: "Consult the Inventory Agent to check stock levels for a specific product SKU across online and stores.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sku: { type: Type.STRING, description: "Product SKU" },
    },
    required: ["sku"],
  },
};

const checkLoyaltyTool: FunctionDeclaration = {
  name: "check_loyalty",
  description: "Consult the Loyalty Agent to get user tier, preferences, past purchases, and eligible promotions.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      userId: { type: Type.STRING, description: "User ID" },
    },
    required: ["userId"],
  },
};

const processPaymentTool: FunctionDeclaration = {
  name: "process_payment",
  description: "Consult the Payment Agent to process a transaction. Use 'UI_GATEWAY' as method to open the secure payment modal for the user.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: { type: Type.NUMBER, description: "Total amount" },
      method: { type: Type.STRING, description: "Payment method. Defaults to 'UI_GATEWAY' for interactive checkout." },
      userId: { type: Type.STRING, description: "User ID" },
      skus: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of SKUs being purchased" }
    },
    required: ["amount", "method"],
  },
};

const scheduleFulfillmentTool: FunctionDeclaration = {
  name: "schedule_fulfillment",
  description: "Consult the Fulfillment Agent to arrange delivery or pickup.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, description: "Type: 'delivery' or 'pickup'" },
      location: { type: Type.STRING, description: "Address or Store Name" },
    },
    required: ["type", "location"],
  },
};

const trackOrderTool: FunctionDeclaration = {
    name: "track_order",
    description: "Consult Post-Purchase Agent to track an order.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            orderId: { type: Type.STRING, description: "Order ID" }
        },
        required: ["orderId"]
    }
};

// --- Helper for Image Fetching ---
async function fetchImageToBase64(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // split to get only the data part: "data:image/jpeg;base64,....." -> "....."
                const base64Data = base64String.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Failed to convert image to base64:", error);
        return null;
    }
}


// --- Service Class ---

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // --- Image Generation for Catalog ---
  async generateProductImage(product: Product): Promise<string | null> {
    try {
        const prompt = `High fashion photography of ${product.name}, ${product.attributes.colorways?.[0]} color, ${product.attributes.material || product.attributes.fabric}, ${product.category}, studio lighting, 4k, futuristic background, neon accents, minimal aesthetic, cinematic`;
        
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image generation failed", e);
        return null;
    }
  }

  // --- Image Generation for Virtual Try-On ---
  async generateTryOnImage(product: Product, user: UserProfile): Promise<string | null> {
    try {
        // 1. Fetch User Image
        const userImageBase64 = await fetchImageToBase64(user.photoUrl);
        
        // 2. Construct Prompt with Chain-of-Thought (CoT) to ensure EXACT identity matching
        const parts: any[] = [];
        let prompt = "";

        if (userImageBase64) {
             parts.push({
                inlineData: {
                    mimeType: "image/jpeg",
                    data: userImageBase64
                }
             });
             prompt = `
                Think step-by-step to perform a photorealistic virtual try-on:
                1. ANALYZE IDENTITY: Look at the provided input image. Identify the person's exact face, hair, skin tone, body shape, and pose. These MUST NOT change.
                2. ANALYZE ENVIRONMENT: Identify the exact background, lighting, and shadows in the input image. These MUST NOT change.
                3. ANALYZE TARGET GARMENT: The target product is a ${product.attributes.colorways?.[0] || ''} ${product.name} (${product.category}). Texture: ${product.attributes.material || product.attributes.fabric || 'standard'}.
                4. GENERATION: Generate a new image where the person from step 1 is wearing the garment from step 3. 
                
                CRITICAL CONSTRAINTS:
                - The face and head must be IDENTICAL to the input image. Do not generate a new face.
                - The background must remain IDENTICAL.
                - The pose must remain IDENTICAL.
                - The clothing fold and fit should match the user's measurements (${user.measurements.height}, ${user.measurements.weight}) and the pose.
             `;
        } else {
             // Fallback prompt if image load fails
             prompt = `
                Photorealistic full-body shot of ${user.visual_description} wearing ${product.name} (${product.attributes.colorways?.[0]}).
                The person is posing confidently in a modern retail environment.
                The fit is ${user.preferences.fit}.
                High resolution, professional fashion photography.
            `;
        }

        parts.push({ text: prompt });

        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: parts
            },
            config: {
                imageConfig: {
                    aspectRatio: "3:4"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Try-On generation failed", e);
        return null;
    }
  }

  startChat(channel: string, user: UserProfile) {
    const systemInstruction = `
    You are 'Omni', an expert Agentic Retail Sales Assistant.
    Your goal: Increase AOV and conversion by guiding the user from discovery to purchase using worker agents.
    
    Current User Context:
    - Name: ${user.name} (ID: ${user.id})
    - Tier: ${user.loyalty_tier}
    - Location: ${user.location} (Use this to recommend nearest stores: NYC, SF, MIA, CHI, DAL, BOS, AUS, SEA, PHX, LA)
    - Budget: ${user.budget}
    - Style Focus: ${user.style_focus.join(', ')}
    - Channel: ${channel}
    - Past Purchases: ${user.purchase_history.map(p => p.sku).join(', ')}
    
    Inventory Knowledge:
    - You have access to stock in: Online, NYC, SF, MIA, Austin, Dallas, Seattle, LA, Chicago, Boston, Denver, Phoenix.
    
    Operating Rules:
    1. **Orchestrate Workers**: DO NOT guess information.
       - Use 'get_recommendations' to find products.
       - Use 'check_inventory' to check stock BEFORE confirming availability.
       - Use 'check_loyalty' to find coupons/promotions.
       - Use 'process_payment' to initiate checkout. IMPORTANT: Use method='UI_GATEWAY' to trigger the secure visual checkout modal for the user.
       - Use 'schedule_fulfillment' after payment.
    2. **Omnichannel Behavior**:
       - If on 'Mobile App/Web': Push for "Add to Cart" or "Delivery".
       - If on 'In-Store Kiosk': Push for "Aisle Location" or "Pay Here & Take Now".
       - If on 'WhatsApp': Keep it brief, conversational, and send links.
    3. **Tone**: Futuristic, high-end, helpful, and concise. "Welcome to the future of retail."
    
    Output Style:
    - Keep responses concise and human-like.
    - Mention savings if a promotion applies.
    `;

    this.chat = this.ai.chats.create({
      model: "gemini-2.5-flash", 
      config: {
        systemInstruction: systemInstruction,
        tools: [{
          functionDeclarations: [
            getRecommendationsTool,
            checkInventoryTool,
            checkLoyaltyTool,
            processPaymentTool,
            scheduleFulfillmentTool,
            trackOrderTool
          ]
        }],
      },
    });
  }

  async sendMessage(message: string, onToolCall?: (toolName: string, args: any) => Promise<any>) {
    if (!this.chat) throw new Error("Chat not initialized");

    let response = await this.chat.sendMessage({ message });
    
    while (response.candidates && response.candidates[0].content.parts.some(p => p.functionCall)) {
      const parts = response.candidates[0].content.parts;
      const functionCalls = parts.filter(p => p.functionCall).map(p => p.functionCall!);
      
      const functionResponses = [];

      for (const call of functionCalls) {
        let result = {};
        if (onToolCall) {
            result = await onToolCall(call.name, call.args);
        }
        
        functionResponses.push({
          id: call.id,
          name: call.name,
          response: { result },
        });
      }

      response = await this.chat.sendMessage({
        message: functionResponses.map(fr => ({
            functionResponse: fr
        }))
      });
    }

    return response.text;
  }
}
