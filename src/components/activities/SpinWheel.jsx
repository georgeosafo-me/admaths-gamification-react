import React, { useState } from 'react';
import { Loader2, Trophy, X, Sparkles } from 'lucide-react';
import { generateSpinWheelQuestion, generateConceptExplanation } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';
import AIHelpModal from '../AIHelpModal';

const AMOUNTS = [1, 2, 5, 10, 20, 50, 100, 200];
const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'
];

const SpinWheel = ({ topic, onCorrect }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // AI Modal State
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');

  // Re-run MathJax when question or feedback changes
  useMathJax([activeQuestion, feedback]);

  const handleAIExplain = async () => {
    if (!activeQuestion) return;
    setAiOpen(true);
    setAiLoading(true);
    
    // We ask AI to explain why the correct answer is correct
    // We can reuse generateConceptExplanation or create a specific one.
    // Let's use generateConceptExplanation but phrase the concept as the question itself.
    try {
        const resultJson = await generateConceptExplanation(topic, `Why is the answer to "${activeQuestion.question}" -> "${activeQuestion.correctAnswer}"?`);
        if (resultJson) {
            const parsed = JSON.parse(resultJson);
            setAiContent(parsed.htmlContent);
        } else {
            setAiContent("Could not generate explanation.");
        }
    } catch (e) {
        setAiContent("Error connecting to AI Tutor.");
    }
    setAiLoading(false);
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setFeedback(null);
    setActiveQuestion(null);

    const spinRot = 1800 + Math.floor(Math.random() * 360);
    const finalRot = rotation + spinRot;
    setRotation(finalRot);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRot = finalRot % 360;
      const segmentAngle = 360 / AMOUNTS.length;
      const effectiveAngle = (360 - normalizedRot) % 360;
      const index = Math.floor(effectiveAngle / segmentAngle);
      const amount = AMOUNTS[index];
      setSelectedAmount(amount);
      fetchQuestion(amount);
    }, 4000);
  };

  const fetchQuestion = async (amount) => {
    setLoading(true);
    const data = await generateSpinWheelQuestion(topic, amount);
    if (data) {
      try {
        const q = JSON.parse(data);
        setActiveQuestion({ ...q, amount });
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  const handleAnswer = (option) => {
    if (!activeQuestion) return;
    if (option === activeQuestion.correctAnswer) {
      setFeedback('correct');
      setScore(s => s + activeQuestion.amount);
      if (onCorrect) onCorrect();
    } else {
      setFeedback('wrong');
    }
  };

  const closeQuestion = () => {
    setActiveQuestion(null);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* SCOREBOARD */}
      <div className="bg-slate-900 px-8 py-4 rounded-2xl border border-amber-500/30 flex items-center gap-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
        <Trophy className="w-8 h-8 text-amber-400" />
        <div>
          <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">Total Earnings</p>
          <p className="text-3xl font-black text-white font-mono">GHS {score}</p>
        </div>
      </div>

      {/* WHEEL CONTAINER */}
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-white drop-shadow-lg">
          <div className="w-8 h-12 bg-slate-800 clip-path-polygon-[50%_100%,0%_0%,100%_0%]"></div>
        </div>
        <div 
          className="w-full h-full rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden relative transition-transform duration-[4000ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
           <div 
             className="absolute inset-0 rounded-full"
             style={{
               background: `conic-gradient(
                 ${AMOUNTS.map((_, i) => `${COLORS[i]} ${i * (360/8)}deg ${(i+1) * (360/8)}deg`).join(', ')}
               )`
             }}
           />
           {AMOUNTS.map((amt, i) => {
             const angle = (i * 45) + 22.5; 
             return (
               <div 
                 key={i}
                 className="absolute top-0 left-0 w-full h-full flex justify-center pt-4"
                 style={{ transform: `rotate(${angle}deg)` }}
               >
                 <span className="font-bold text-white text-lg drop-shadow-md">GHS {amt}</span>
               </div>
             );
           })}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-700 z-10 shadow-xl">
           <span className="text-2xl">🇬🇭</span>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || activeQuestion}
        className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-bold text-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
      >
        {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
      </button>

      {/* QUESTION MODAL */}
      {(loading || activeQuestion) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
            {loading ? (
               <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
                  <p className="text-lg animate-pulse">Consulting the Oracle for a GHS {selectedAmount} question...</p>
               </div>
            ) : (
               <div className="flex flex-col h-full">
                  <div className="bg-slate-800 p-6 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full mb-2">
                           FOR GHS {activeQuestion.amount}
                        </span>
                        <h3 className="text-xl font-bold text-white">Prize Question</h3>
                    </div>
                    {feedback && (
                        <button onClick={closeQuestion} className="p-2 hover:bg-slate-700 rounded-full text-slate-400">
                           <X className="w-6 h-6" />
                        </button>
                    )}
                  </div>

                  <div className="p-8 overflow-y-auto max-h-[60vh]">
                     {/* MathJax enabled content */}
                     <div className="text-lg text-slate-200 mb-8 leading-relaxed font-medium">
                        {/* We render simple text for now, assuming math is passed as text and caught by hook */}
                        {activeQuestion.question}
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeQuestion.options.map((opt, idx) => {
                           let btnClass = "p-4 rounded-xl border-2 text-left transition-all font-medium ";
                           if (feedback) {
                              if (opt === activeQuestion.correctAnswer) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                              else if (opt === activeQuestion.selected && opt !== activeQuestion.correctAnswer) btnClass += "bg-rose-500/20 border-rose-500 text-rose-400";
                              else btnClass += "bg-slate-800 border-slate-700 opacity-50";
                           } else {
                              btnClass += "bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-700 text-slate-300";
                           }

                           return (
                             <button 
                                key={idx}
                                disabled={!!feedback}
                                onClick={() => handleAnswer(opt)}
                                className={btnClass}
                             >
                                <span className="mr-3 font-bold opacity-50">{String.fromCharCode(65+idx)}.</span>
                                {opt}
                             </button>
                           );
                        })}
                     </div>
                  </div>
                  
                  {feedback && (
                    <div className={`p-6 border-t ${feedback === 'correct' ? 'bg-emerald-900/20 border-emerald-900/50' : 'bg-rose-900/20 border-rose-900/50'}`}>
                       <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${feedback === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                             {feedback === 'correct' ? <Trophy className="w-6 h-6" /> : <X className="w-6 h-6" />}
                          </div>
                          <div>
                             <h4 className={`text-lg font-bold mb-1 ${feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {feedback === 'correct' ? 'Correct! Earnings Updated.' : 'Incorrect! Better luck next spin.'}
                             </h4>
                          </div>
                          <button 
                            onClick={handleAIExplain}
                            className="ml-auto mr-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-2"
                          >
                             <Sparkles className="w-4 h-4" /> Explain Why
                          </button>
                          <button 
                            onClick={closeQuestion}
                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                          >
                             Continue
                          </button>
                       </div>
                    </div>
                  )}
               </div>
            )}
          </div>
        </div>
      )}

      <AIHelpModal 
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        title="AI Explanation"
        content={aiContent}
        loading={aiLoading}
      />
    </div>
  );
};

export default SpinWheel;
