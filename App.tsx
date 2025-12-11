import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GeminiService, recommendationWorker, inventoryWorker, loyaltyWorker, paymentWorker } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ControlPanel from './components/ControlPanel';
import Catalog from './components/Catalog';
import HandoffModal from './components/HandoffModal';
import PaymentModal from './components/PaymentModal';
import CartDrawer from './components/CartDrawer';
import { AgentType, Channel, Message, Product, UserProfile } from './types';
import { MOCK_USERS, CHANNELS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [currentChannel, setCurrentChannel] = useState<Channel>(CHANNELS[0]);
  const [activeTab, setActiveTab] = useState<'concierge' | 'catalog'>('concierge');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Handoff State
  const [showHandoff, setShowHandoff] = useState(false);
  const [handoffTarget, setHandoffTarget] = useState('');

  // Cart State
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Payment State
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [pendingPaymentResolver, setPendingPaymentResolver] = useState<((value: any) => void) | null>(null);

  // Dashboard State
  const [lastAction, setLastAction] = useState<string>("System Ready");
  
  const geminiRef = useRef<GeminiService | null>(null);

  const initGemini = useCallback(() => {
    if (!process.env.API_KEY) {
      console.error("API_KEY missing");
      return;
    }
    const service = new GeminiService();
    service.startChat(currentChannel, currentUser);
    geminiRef.current = service;
    
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        content: `Welcome back, ${currentUser.name.split(' ')[0]}! I see you're on ${currentChannel}. How can I elevate your ${currentUser.style_focus[0]} look today?`,
        timestamp: new Date()
      }
    ]);
  }, [currentChannel, currentUser]);

  useEffect(() => {
    initGemini();
  }, [initGemini]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice Recognition Handler
  const handleVoiceStart = () => {
    if ('webkitSpeechRecognition' in window) {
        setIsListening(true);
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };
        
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognition.start();
    } else {
        alert("Speech recognition is not supported in this browser.");
    }
  };

  // Virtual Try-On Handler
  const handleTryOn = async (product: Product) => {
    if (!geminiRef.current) return;
    
    const image = await geminiRef.current.generateTryOnImage(product, currentUser);
    
    if (image) {
        setMessages(prev => prev.map(msg => {
            if (msg.attachments && msg.attachments.some(p => p.sku === product.sku)) {
                return {
                    ...msg,
                    attachments: msg.attachments.map(p => 
                        p.sku === product.sku ? { ...p, tryOnImage: image } : p
                    )
                };
            }
            return msg;
        }));
        setLastAction(`Rec Agent: Generated Try-On for ${product.sku}`);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    setLastAction(`User added to bag: ${product.sku}`);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (sku: string) => {
      setCart(prev => {
          // Remove only the first instance of this SKU found
          const idx = prev.findIndex(p => p.sku === sku);
          if (idx > -1) {
              const newCart = [...prev];
              newCart.splice(idx, 1);
              return newCart;
          }
          return prev;
      });
  };

  const handleCheckoutFromCart = (calculatedTotal: number) => {
      setPaymentAmount(calculatedTotal);
      setIsCartOpen(false);
      setShowPayment(true);
      setLastAction('User initiated checkout from Cart');
  };

  const handleChannelChange = (newChannel: Channel) => {
    if (currentChannel === 'Mobile App' && newChannel === 'In-Store Kiosk') {
        setHandoffTarget(newChannel);
        setShowHandoff(true);
    }

    setCurrentChannel(newChannel);
    const sysMsg: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `User switched channel to: ${newChannel}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, sysMsg]);
    
    if (geminiRef.current) {
        geminiRef.current.sendMessage(`[SYSTEM UPDATE: User moved to ${newChannel}. Maintain session context but adapt tone/CTAs.]`);
    }
  };

  const handleToolCall = async (toolName: string, args: any): Promise<any> => {
    const msgId = Date.now().toString();
    
    let agentType = AgentType.SALES;
    let description = "Processing...";
    
    switch (toolName) {
      case 'get_recommendations':
        agentType = AgentType.RECOMMENDATION;
        description = `Analyzing catalogs for ${args.category || args.query || 'items'}...`;
        break;
      case 'check_inventory':
        agentType = AgentType.INVENTORY;
        description = `Scanning global stock for ${args.sku}...`;
        break;
      case 'check_loyalty':
        agentType = AgentType.LOYALTY;
        description = `Retrieving ${currentUser.loyalty_tier} tier benefits...`;
        break;
      case 'process_payment':
        agentType = AgentType.PAYMENT;
        description = `Initializing Secure Gateway...`;
        break;
      case 'schedule_fulfillment':
        agentType = AgentType.FULFILLMENT;
        description = `Coordinating ${args.type} logistics...`;
        break;
      case 'track_order':
        agentType = AgentType.FULFILLMENT;
        description = `Locating order ${args.orderId}...`;
        break;
    }

    setLastAction(`${agentType}: ${toolName}`);

    setMessages(prev => [...prev, {
      id: msgId,
      role: 'model',
      content: '', 
      timestamp: new Date(),
      agentAction: {
        agent: agentType,
        status: 'working',
        details: description
      }
    }]);

    await new Promise(resolve => setTimeout(resolve, 800));

    let result: any = { status: 'success' };
    let attachments: Product[] = [];

    if (toolName === 'get_recommendations') {
      const products = recommendationWorker(args.category, args.query);
      result = { products: products.map(p => ({ name: p.name, sku: p.sku, price: p.price, tags: p.tags, attributes: p.attributes })) };
      attachments = products;
    } else if (toolName === 'check_inventory') {
      result = inventoryWorker(args.sku) || { status: 'sku_not_found' };
    } else if (toolName === 'check_loyalty') {
        result = loyaltyWorker(args.userId);
    } else if (toolName === 'process_payment') {
        const workerResult = paymentWorker(args.amount, args.method, args.userId, args.skus);
        
        if (workerResult.action === 'open_payment_modal') {
            setPaymentAmount(args.amount);
            setShowPayment(true);
            try {
                const transactionId = await new Promise((resolve, reject) => {
                    setPendingPaymentResolver(() => resolve); 
                });
                result = { status: 'authorized', transactionId };
                // Clear cart on successful AI-triggered payment
                setCart([]); 
            } catch (e) {
                result = { status: 'cancelled' };
            }
        } else {
            result = workerResult;
        }

    } else if (toolName === 'schedule_fulfillment') {
        result = { confirmation: `ORD-${Math.floor(Math.random() * 90000) + 10000}`, eta: '24-48 hours' };
    } else if (toolName === 'track_order') {
        result = { status: 'in_transit', location: 'Distribution Center', eta: 'Tomorrow' };
    }

    setMessages(prev => prev.map(m => m.id === msgId ? {
        ...m,
        agentAction: { ...m.agentAction!, status: 'completed', details: 'Task completed' },
        attachments: attachments.length > 0 ? attachments : undefined
    } : m));

    return result;
  };

  const handlePaymentComplete = (txnId: string) => {
    setShowPayment(false);
    // Clear cart if payment was successful
    setCart([]);
    
    if (pendingPaymentResolver) {
        pendingPaymentResolver(txnId);
        setPendingPaymentResolver(null);
    } else {
        // Direct manual checkout from Drawer without AI loop
        const sysMsg: Message = {
            id: Date.now().toString(),
            role: 'system',
            content: `Payment Successful! Transaction ID: ${txnId}`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, sysMsg]);
        if (geminiRef.current) {
            geminiRef.current.sendMessage(`[SYSTEM: User completed payment manually. Transaction ${txnId}. Trigger fulfillment.]`);
        }
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !geminiRef.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await geminiRef.current.sendMessage(input, handleToolCall);
      
      if (responseText) {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + 'resp',
            role: 'model',
            content: responseText,
            timestamp: new Date()
          }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'err',
        role: 'model',
        content: "I'm having trouble connecting to the network. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {showHandoff && (
          <HandoffModal 
            user={currentUser} 
            targetChannel={handoffTarget} 
            onClose={() => setShowHandoff(false)} 
          />
      )}

      {showPayment && (
          <PaymentModal
            amount={paymentAmount}
            user={currentUser}
            onComplete={handlePaymentComplete}
            onCancel={handlePaymentCancel}
          />
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        user={currentUser}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckoutFromCart}
      />

      <ControlPanel 
        currentChannel={currentChannel}
        currentUser={currentUser}
        onChannelChange={handleChannelChange}
        onUserChange={(uid) => {
            const u = MOCK_USERS.find(user => user.id === uid);
            if (u) setCurrentUser(u);
        }}
        onReset={initGemini}
        cartItemCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="flex-1 overflow-hidden relative flex flex-col lg:flex-row max-w-7xl mx-auto w-full gap-6 p-4 lg:p-6">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full bg-slate-900/50 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border border-slate-800">
            
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800">
                <button 
                    onClick={() => setActiveTab('concierge')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'concierge' ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    AI Concierge
                </button>
                <button 
                    onClick={() => setActiveTab('catalog')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'catalog' ? 'bg-slate-800 text-fuchsia-400 border-b-2 border-fuchsia-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Collections
                </button>
            </div>

            {/* View Switcher */}
            {activeTab === 'concierge' ? (
                <>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-slate-900 to-slate-950">
                        {messages.map(msg => (
                            <ChatMessage 
                                key={msg.id} 
                                message={msg} 
                                user={currentUser}
                                onTryOn={handleTryOn} 
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-cyan-400 text-sm ml-4 mb-4 animate-pulse font-mono">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                                <span>OMNI IS THINKING...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-5 bg-slate-900 border-t border-slate-800">
                        <div className="flex items-end gap-3 bg-slate-950 border border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-500 transition-all shadow-inner relative">
                            <button 
                                onClick={handleVoiceStart}
                                className={`p-3 transition-colors rounded-xl ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-slate-500 hover:text-cyan-400'}`}
                                title="Use Voice Input"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>
                            <textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={isListening ? "Listening..." : "Type a message to Omni..."}
                                className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 py-3 text-sm text-slate-200 placeholder-slate-600 font-medium"
                                rows={1}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className={`p-3 rounded-xl transition-all ${!input.trim() ? 'text-slate-700' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 transform hover:scale-105 active:scale-95'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409 5 5 0 111.725 0h.002a1 1 0 001.169-1.409l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <Catalog geminiService={geminiRef.current} />
            )}
        </div>

        {/* Sidebar Dashboard */}
        <div className="hidden lg:flex w-80 flex-col gap-6">
             {/* Profile Card */}
             <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-fuchsia-500/30 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 rounded-bl-full blur-xl group-hover:bg-fuchsia-500/20 transition-all"></div>
                
                {/* Session ID Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-950/50 px-2 py-1 rounded border border-slate-700/50">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-mono text-slate-400">ID: {currentUser.id.toUpperCase()}-SESS</span>
                </div>

                <h3 className="font-bold text-slate-100 mb-6 text-[10px] uppercase tracking-[0.2em] text-fuchsia-400">
                    Active Customer
                </h3>
                
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-fuchsia-600 to-purple-600 shadow-lg relative">
                        <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-white text-lg leading-tight">{currentUser.name}</div>
                        <div className="text-xs text-slate-400">{currentUser.location.split('-')[0]}</div>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                   <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <span className="text-slate-500 text-xs">Tier Status</span>
                        <span className="font-bold text-xs bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700">{currentUser.loyalty_tier}</span>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <span className="text-slate-500 text-xs">Est. Budget</span>
                        <span className="font-mono font-bold text-emerald-400">${currentUser.budget}</span>
                   </div>
                   <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <span className="text-slate-500 text-xs block mb-1">Measurements</span>
                        <div className="flex gap-2 text-[10px] text-slate-300 font-mono">
                            <span>H:{currentUser.measurements.height}</span>
                            <span>S:{currentUser.measurements.shoe}</span>
                            {currentUser.measurements.waist && <span>W:{currentUser.measurements.waist}</span>}
                        </div>
                   </div>
                </div>
             </div>

             {/* Live Log */}
             <div className="bg-black/40 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-xl flex-1 overflow-hidden flex flex-col">
                 <h3 className="font-bold text-slate-500 mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    System Stream
                 </h3>
                 <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] pr-2 scrollbar-hide">
                    {messages.filter(m => m.role === 'system' || m.agentAction).slice(-10).map((m, i) => (
                        <div key={i} className="flex gap-2 border-l border-slate-800 pl-3 py-1 opacity-80 hover:opacity-100 transition-opacity">
                            {m.agentAction ? (
                                <>
                                    <span className="text-cyan-500 font-bold min-w-[30px]">{m.agentAction.agent.split(' ')[0].substring(0,3)}</span>
                                    <span className="text-slate-400">{m.agentAction.details}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-fuchsia-500 font-bold min-w-[30px]">SYS</span>
                                    <span className="text-slate-500">{m.content}</span>
                                </>
                            )}
                        </div>
                    ))}
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-800 text-[9px] text-slate-600 font-mono uppercase">
                    Latest Ops: <span className="text-slate-400">{lastAction}</span>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default App;