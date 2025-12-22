import React, { useEffect, useState } from 'react';
import { X, Calculator, Quote, Brain, PenTool, Sparkles } from 'lucide-react';

const iconMap = {
  Calculator,
  Quote,
  Brain,
  PenTool
};

const RewardModal = ({ isOpen, onClose, reward }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 300);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  const Icon = iconMap[reward.icon] || Sparkles;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative bg-slate-900 border border-emerald-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
        
        {/* Confetti / Sparkles decoration (CSS only for simplicity) */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Icon className="w-10 h-10 text-emerald-400" />
          </div>

          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-2">Reward Unlocked!</h3>
          <h2 className="text-2xl font-bold text-white mb-4">{reward.title}</h2>
          
          <p className="text-slate-300 leading-relaxed italic">
            {reward.content}
          </p>

          <button 
            onClick={onClose}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full font-bold shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105"
          >
            Awesome, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
