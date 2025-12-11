import React, { useState, useEffect } from 'react';
import { PaymentMethod, UserProfile } from '../types';

interface PaymentModalProps {
  amount: number;
  user: UserProfile;
  onComplete: (transactionId: string) => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, user, onComplete, onCancel }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>(user.payment_methods[0]?.id || '');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');

  const handlePay = () => {
    setProcessing(true);
    setStep('processing');
    
    // Simulate gateway delay
    setTimeout(() => {
        setStep('success');
        setTimeout(() => {
            onComplete(`TXN-${Date.now()}-VISUAL`);
        }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Secure Checkout
            </h3>
            <button onClick={onCancel} className="text-slate-500 hover:text-white">✕</button>
        </div>

        {/* Content */}
        <div className="p-6">
            {step === 'select' && (
                <>
                    <div className="mb-6 text-center">
                        <p className="text-slate-400 text-sm uppercase tracking-wide">Total Amount</p>
                        <h2 className="text-4xl font-bold text-white mt-2">${amount.toFixed(2)}</h2>
                    </div>

                    <div className="space-y-3 mb-8">
                        <p className="text-xs text-slate-500 font-bold uppercase">Select Payment Method</p>
                        {user.payment_methods.map(method => (
                            <div 
                                key={method.id} 
                                onClick={() => setSelectedMethod(method.id)}
                                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedMethod === method.id ? 'bg-cyan-900/20 border-cyan-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-6 rounded bg-slate-200 flex items-center justify-center text-[8px] font-bold ${method.type === 'visa' ? 'text-blue-800' : 'text-orange-600'}`}>
                                        {method.type.toUpperCase()}
                                    </div>
                                    <div className="text-sm text-slate-200">
                                        •••• •••• •••• {method.last4}
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500">Exp {method.expiry}</div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handlePay}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        Pay Now
                    </button>
                </>
            )}

            {step === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin mb-6"></div>
                    <h4 className="text-lg font-bold text-white">Processing Payment...</h4>
                    <p className="text-slate-500 text-sm mt-2">Connecting to Gateway...</p>
                </div>
            )}

            {step === 'success' && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Payment Approved</h4>
                    <p className="text-slate-500 text-sm mt-2">Transaction ID: TXN-8829-X</p>
                </div>
            )}
        </div>

        {/* Footer Security Badge */}
        <div className="bg-slate-950 p-3 text-center border-t border-slate-800">
            <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                256-bit SSL Encrypted Connection
            </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;