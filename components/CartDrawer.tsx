import React, { useMemo } from 'react';
import { Product, UserProfile } from '../types';
import { MOCK_PROMOTIONS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  user: UserProfile;
  onRemove: (sku: string) => void;
  onCheckout: (finalTotal: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, user, onRemove, onCheckout }) => {
  
  // Calculate Totals and Discounts
  const { subtotal, discount, appliedPromos, total } = useMemo(() => {
    const sub = items.reduce((sum, item) => sum + item.price, 0);
    
    let discountAmount = 0;
    const promos: { code: string; value: number; desc: string }[] = [];
    const itemSkus = items.map(i => i.sku);

    // Iterate through available promotions
    MOCK_PROMOTIONS.forEach(promo => {
        // 1. Check Tier Eligibility
        if (!promo.tiers.includes(user.loyalty_tier)) return;

        let currentPromoValue = 0;
        let applied = false;

        // 2. Check Category-based Percent Discounts (e.g., 25% off Dresses)
        if (promo.discount_type === 'percent' && promo.applicable_categories) {
            const eligibleItems = items.filter(i => promo.applicable_categories?.includes(i.category));
            if (eligibleItems.length > 0) {
                const eligibleTotal = eligibleItems.reduce((sum, i) => sum + i.price, 0);
                currentPromoValue = eligibleTotal * (promo.value / 100);
                applied = true;
            }
        }

        // 3. Check Bundle Fixed Discounts (e.g., Sneaker + Jacket = $40 off)
        else if (promo.bundle_skus) {
            // Check if cart contains ALL bundle SKUs
            const hasBundle = promo.bundle_skus.every(sku => itemSkus.includes(sku));
            if (hasBundle) {
                currentPromoValue = promo.value;
                applied = true;
            }
        }

        // 4. Check Flat Loyalty Bonuses
        else if (promo.code.includes('LOYALTY-BONUS')) {
             // Apply if cart has items and value > 0
             if (sub > 0) {
                 currentPromoValue = promo.value;
                 applied = true;
             }
        }

        // Apply if valid
        if (applied && currentPromoValue > 0) {
            discountAmount += currentPromoValue;
            promos.push({ code: promo.code, value: currentPromoValue, desc: promo.description });
        }
    });

    // Cap discount at subtotal (cannot be negative)
    discountAmount = Math.min(discountAmount, sub);
    
    const tax = (sub - discountAmount) * 0.08;
    const finalTotal = (sub - discountAmount) + tax;

    return { 
        subtotal: sub, 
        discount: discountAmount, 
        appliedPromos: promos, 
        total: finalTotal 
    };
  }, [items, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl border-l border-slate-800 flex flex-col animate-slideInRight">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Shopping Bag
                <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full font-mono">{items.length}</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-sm">Your bag is empty</p>
                    <button onClick={onClose} className="text-cyan-400 text-sm font-bold hover:underline">Continue Shopping</button>
                </div>
            ) : (
                items.map((item, index) => (
                    <div key={`${item.sku}-${index}`} className="flex gap-4 animate-fadeIn">
                        <div className="w-20 h-24 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 group relative">
                            <img src={item.generatedImage || item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                            {item.generatedImage && (
                                <div className="absolute top-0 right-0 p-1 bg-fuchsia-600/80 rounded-bl-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <p className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wide">{item.category}</p>
                                <h4 className="text-sm font-medium text-white line-clamp-2">{item.name}</h4>
                                <p className="text-xs text-slate-400 mt-1">{item.attributes.colorways?.[0]}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-mono text-cyan-400">${item.price}</span>
                                <button 
                                    onClick={() => onRemove(item.sku)}
                                    className="text-[10px] text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wide"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
            <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
                
                {/* Active Promotions List */}
                {appliedPromos.length > 0 && (
                    <div className="bg-emerald-900/10 border border-emerald-900/50 rounded-lg p-3 space-y-2">
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Discounts Applied
                        </p>
                        {appliedPromos.map((promo, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-emerald-400/80">
                                <span>{promo.code} <span className="text-[9px] opacity-70 ml-1">({promo.desc})</span></span>
                                <span>-${promo.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-2 text-sm pt-2">
                    <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-medium">
                            <span>Savings</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                        <span>Est. Tax (8%)</span>
                        <span>${((subtotal - discount) * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-slate-800 mt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <button 
                    onClick={() => onCheckout(total)}
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
                >
                    Proceed to Checkout
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;