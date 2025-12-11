export interface ProductAttributes {
  fit?: string;
  fabric?: string;
  occasion?: string;
  colorways?: string[];
  style?: string;
  upper?: string;
  waterproof?: boolean;
  season?: string;
  insulation?: string;
  material?: string;
  wash?: string;
  stretch?: string;
  size?: string;
  lens?: string;
  feature?: string;
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  attributes: ProductAttributes;
  price: number;
  images: string[];
  tags: string[];
  generatedImage?: string; // For GenAI catalog features
  tryOnImage?: string; // For Virtual Try-On results
}

export interface InventoryStatus {
  online: number;
  [key: string]: number; // Dynamic keys like store_nyc, store_sf, etc.
}

export interface PastPurchase {
  sku: string;
  date: string;
  channel: string;
  value: number;
  image?: string;
}

export interface UserPreferences {
  fit: string;
  colors: string[];
  sizes: Record<string, string>;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
}

export interface UserMeasurements {
  height: string;
  weight: string;
  bust?: string;
  waist: string;
  hips?: string;
  shoe: string;
}

export interface UserProfile {
  id: string;
  name: string;
  photoUrl: string; // New: User avatar
  visual_description: string; // New: For GenAI prompts
  loyalty_tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  location: string;
  device_pref: string[];
  style_focus: string[];
  budget: string;
  purchase_history: PastPurchase[];
  aov: number;
  preferences: UserPreferences;
  measurements: UserMeasurements; // New: For Try-On accuracy
  payment_methods: PaymentMethod[]; // New: For Payment Gateway
}

export interface Promotion {
  code: string;
  description: string;
  discount_type: 'percent' | 'fixed';
  value: number;
  applicable_categories?: string[];
  bundle_skus?: string[];
  tiers: string[];
  start: string;
  end: string;
  stackable: boolean;
  frequency?: string;
}

export enum AgentType {
  SALES = 'Sales Agent',
  RECOMMENDATION = 'Recommendation Agent',
  INVENTORY = 'Inventory Agent',
  PAYMENT = 'Payment Agent',
  FULFILLMENT = 'Fulfillment Agent',
  LOYALTY = 'Loyalty Agent'
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  agentAction?: {
    agent: AgentType;
    status: 'working' | 'completed' | 'failed';
    details?: string;
  };
  attachments?: Product[];
}

export type Channel = 'Mobile App' | 'Web Store' | 'In-Store Kiosk' | 'WhatsApp';

// Speech Recognition Types for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}