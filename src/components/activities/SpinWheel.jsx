import React, { useState } from 'react';
import { Loader2, Sparkles, RefreshCcw, HelpCircle } from 'lucide-react';
import { callGemini } from '../../quests/geometry-trigonometry/coordinate-geometry/utils/geometryLogic';

const SpinWheel = ({ topic }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const spin = async () => {
    setIsSpinning(true);
    setResult(null);
    
    // Simulate spin animation
    setTimeout(async () => {
      setIsSpinning(false);
      await generateChallenge();
    }, 2000);
  };

  const generateChallenge = async () => {
    setLoading(true);
    const prompt = `
      Generate a single, fun, short gamified challenge for High School Additional Math topic: "${topic}".
      It could be a "Trivia Question", a "Mental Math" calculation, or a "Did You Know" fact.
      
      Format strictly as JSON:
      {
        "type": "trivia" | "calc" | "fact",
        "title": "Short Title",
        "content": "The question or fact content",
        "answer": "The answer (if applicable) or hidden"
      }
    `;

    const response = await callGemini(prompt, true);
    if (response) {
      try {
        setResult(JSON.parse(response));
      } catch (e) {
        setResult({
            type: 'fact',
            title: 'Math Fact',
            content: 'Coordinate geometry was pioneered by René Descartes!',
            answer: null
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-2xl border border-slate-700 min-h-[400px]">
      <div className={`relative w-64 h-64 mb-8 transition-transform duration-[2000ms] cubic-bezier(0.2, 0.8, 0.2, 1) ${isSpinning ? 'rotate-[1080deg]' : ''}`}>
        {/* Simple visual wheel representation using conic gradient */}
        <div className="w-full h-full rounded-full bg-[conic-gradient(from_0deg,#f43f5e_0deg_60deg,#10b981_60deg_120deg,#3b82f6_120deg_180deg,#f59e0b_180deg_240deg,#8b5cf6_240deg_300deg,#ec4899_300deg_360deg)] shadow-2xl border-4 border-slate-700 relative flex items-center justify-center">
            <div className="w-48 h-48 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-700">
                <span className="text-4xl">🎲</span>
            </div>
        </div>
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-white text-4xl">▼</div>
      </div>

      {!result && !loading && (
        <button 
            onClick={spin}
            disabled={isSpinning}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
        >
            {isSpinning ? 'Spinning...' : 'Spin for a Reward!'}
        </button>
      )}

      {loading && (
         <div className="flex items-center gap-2 text-indigo-400">
            <Loader2 className="animate-spin" /> Generating your prize...
         </div>
      )}

      {result && (
        <div className="w-full max-w-md bg-slate-700/50 p-6 rounded-xl border border-slate-600 animate-in zoom-in duration-300 text-center">
            <div className="flex justify-center mb-4">
                {result.type === 'fact' ? <Sparkles className="w-8 h-8 text-yellow-400" /> : <HelpCircle className="w-8 h-8 text-emerald-400" />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{result.title}</h3>
            <p className="text-slate-300 mb-4 text-lg">{result.content}</p>
            
            {result.answer && (
                <div className="bg-slate-800 p-3 rounded-lg text-emerald-400 font-mono text-sm inline-block">
                    Answer: {result.answer}
                </div>
            )}

            <button 
                onClick={spin}
                className="mt-6 flex items-center gap-2 mx-auto text-slate-400 hover:text-white text-sm"
            >
                <RefreshCcw className="w-4 h-4" /> Spin Again
            </button>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
