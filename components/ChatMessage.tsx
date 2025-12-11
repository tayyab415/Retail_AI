import React, { useState } from 'react';
import { AgentType, Message, Product, UserProfile } from '../types';

interface ChatMessageProps {
  message: Message;
  user?: UserProfile; // Optional user prop to show photo
  onTryOn?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user, onTryOn, onAddToCart }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  // State to track loading for specific product Try-On
  const [loadingSku, setLoadingSku] = useState<string | null>(null);

  const handleTryOnClick = async (product: Product) => {
    if (onTryOn) {
        setLoadingSku(product.sku);
        await onTryOn(product);
        setLoadingSku(null);
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 animate-fadeIn">
        <span className="text-[10px] font-mono font-medium text-cyan-400/80 bg-cyan-950/30 border border-cyan-800/50 px-3 py-1 rounded-sm uppercase tracking-widest backdrop-blur-sm flex items-center gap-2">
          {message.content.includes("switched") && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>}
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full mb-6 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] lg:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border overflow-hidden ${
            isUser 
            ? 'bg-fuchsia-600 border-fuchsia-400 text-white' 
            : 'bg-cyan-600 border-cyan-400 text-white'
        }`}>
          {isUser && user?.photoUrl ? (
             <img src={user.photoUrl} alt="User" className="w-full h-full object-cover" />
          ) : isUser ? (
            <span className="font-bold">{user?.name.charAt(0) || 'U'}</span>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          )}
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {/* Main Bubble */}
          <div className={`p-4 rounded-xl text-sm leading-relaxed backdrop-blur-md shadow-lg transition-all ${
            isUser 
              ? 'bg-fuchsia-900/40 border border-fuchsia-700/50 text-white rounded-tr-sm' 
              : 'bg-slate-800/50 border border-slate-700 text-slate-100 rounded-tl-sm'
          }`}>
            {message.content}
          </div>

          {/* Worker Agent Status Indicator */}
          {message.agentAction && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 ml-1 animate-fadeIn font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${message.agentAction.status === 'working' ? 'bg-amber-400 animate-pulse' : 'bg-cyan-400'}`}></span>
              <span className="font-bold uppercase tracking-wider text-[9px]">{message.agentAction.agent}</span>
              <span className="truncate text-slate-500 opacity-80">:: {message.agentAction.details}</span>
            </div>
          )}

          {/* Product Attachments (Recommendations) */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex gap-4 overflow-x-auto py-3 scrollbar-hide max-w-full">
              {message.attachments.map((product) => (
                <div key={product.sku} className="min-w-[260px] md:min-w-[280px] max-w-[280px] bg-slate-900/80 rounded-xl shadow-xl border border-slate-700 overflow-hidden flex-shrink-0 group hover:border-cyan-500/50 transition-all duration-300">
                  <div className="h-48 overflow-hidden relative bg-slate-800">
                    {/* Image - Show Try-On Result if available, else Product Image */}
                    <img 
                        src={product.tryOnImage || product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-bl-xl text-[12px] font-bold text-cyan-400 border-l border-b border-slate-800">
                      ${product.price}
                    </div>

                    {/* Try-On Badge */}
                    {product.tryOnImage && (
                        <div className="absolute top-2 left-2 bg-fuchsia-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Virtual Try-On
                        </div>
                    )}
                  </div>
                  
                  <div className="p-4 relative">
                    <div className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-widest mb-1">{product.category}</div>
                    <h4 className="font-medium text-slate-100 text-sm truncate" title={product.name}>{product.name}</h4>
                    
                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                        <button 
                            onClick={() => onAddToCart && onAddToCart(product)}
                            className="flex-1 bg-slate-800 hover:bg-white hover:text-black text-white text-[10px] md:text-xs font-bold py-2.5 rounded-lg border border-slate-700 transition-colors uppercase shadow-lg whitespace-nowrap px-2"
                        >
                            Add to Cart
                        </button>
                        {onTryOn && !product.tryOnImage && (
                            <button 
                                onClick={() => handleTryOnClick(product)}
                                disabled={loadingSku === product.sku}
                                className="px-3 bg-fuchsia-900/30 hover:bg-fuchsia-600 hover:text-white text-fuchsia-400 border border-fuchsia-800/50 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                                title="Virtual Try-On"
                            >
                                {loadingSku === product.sku ? (
                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;