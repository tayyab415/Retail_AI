import React from 'react';
import { UserProfile } from '../types';

interface HandoffModalProps {
  user: UserProfile;
  targetChannel: string;
  onClose: () => void;
}

const HandoffModal: React.FC<HandoffModalProps> = ({ user, targetChannel, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Secure Handoff</h3>
            <p className="text-slate-400 text-sm">
                Scanning to transfer session to <br/> 
                <span className="text-cyan-400 font-bold">{targetChannel}</span>
            </p>
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-white p-4 rounded-xl w-48 h-48 mx-auto mb-6 relative group cursor-pointer shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=OMNIFLOW_SESSION_${user.id}_${Date.now()}`} 
                    alt="Session QR" 
                    className="w-full h-full object-contain"
                 />
            </div>
            {/* Scan animation overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-scan"></div>
        </div>

        <div className="text-center space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-slate-300 font-mono uppercase">Context Synced</span>
             </div>
             <p className="text-xs text-slate-500">
                Session ID: <span className="font-mono">{user.id.toUpperCase()}-X92</span>
             </p>
        </div>

        <button 
            onClick={onClose}
            className="mt-8 w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all text-sm uppercase tracking-wide"
        >
            Done
        </button>
      </div>
    </div>
  );
};

export default HandoffModal;