import React from 'react';
import { CHANNELS, MOCK_USERS } from '../constants';
import { Channel, UserProfile } from '../types';

interface ControlPanelProps {
  currentChannel: Channel;
  currentUser: UserProfile;
  onChannelChange: (channel: Channel) => void;
  onUserChange: (userId: string) => void;
  onReset: () => void;
  cartItemCount: number;
  onOpenCart: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  currentChannel,
  currentUser,
  onChannelChange,
  onUserChange,
  onReset,
  cartItemCount,
  onOpenCart
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        </div>
        <div>
           <h1 className="text-xl font-bold text-white leading-tight tracking-tight">OmniFlow <span className="text-cyan-400">X</span></h1>
           <p className="text-[10px] text-slate-400 uppercase tracking-widest">Retail Intelligence OS</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {/* User Selector */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Profile</label>
          <select 
            value={currentUser.id}
            onChange={(e) => onUserChange(e.target.value)}
            className="text-sm border border-slate-700 rounded-lg px-3 py-2 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none hover:bg-slate-750 transition-colors"
          >
            {MOCK_USERS.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        {/* Channel Selector */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Channel</label>
          <select 
            value={currentChannel}
            onChange={(e) => onChannelChange(e.target.value as Channel)}
            className="text-sm border border-slate-700 rounded-lg px-3 py-2 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none hover:bg-slate-750 transition-colors"
          >
            {CHANNELS.map(ch => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-4 md:ml-2">
            {/* Cart Button */}
            <button 
                onClick={onOpenCart}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all group"
                title="View Cart"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-fuchsia-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-slate-900 shadow-sm animate-fadeIn">
                        {cartItemCount}
                    </span>
                )}
            </button>

            <button 
            onClick={onReset}
            className="text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 px-3 py-2 rounded-lg transition-all border border-rose-500/20"
            >
            RESET
            </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;