import React from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import useMathJax from '../hooks/useMathJax';

const AIHelpModal = ({ isOpen, onClose, title, content, loading }) => {
  // Ensure math is rendered whenever content or loading state changes
  useMathJax([content, loading, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-indigo-500/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0 z-10">
          <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            {title || "Kofi Explains..."}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Removed 'flex items-center justify-center' to prevent vertical centering clipping issues */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[150px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-mono animate-pulse">Consulting AI Tutor...</p>
            </div>
          ) : (
            <div className="text-slate-200 leading-relaxed text-lg math-content w-full" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>

        {!loading && (
          <div className="p-4 bg-slate-900/30 border-t border-slate-700 flex justify-end flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
              Got it!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHelpModal;
