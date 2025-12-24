import React, { useState, useEffect } from 'react';
import { Loader2, Trophy, X, Sparkles, ArrowRight, AlertTriangle, Target } from 'lucide-react';
import { generateSpinWheelAllAmounts, generateSpinWheelQuestion, generateConceptExplanation } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';
import AIHelpModal from '../AIHelpModal';
import GhanaFlagPointer from '../GhanaFlagPointer';

const AMOUNTS = [1, 2, 5, 10, 20, 50, 100, 200];
const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'
];

// Challenge Config
const CHALLENGE_TARGET = 100;
const CHALLENGE_SPINS = 5;

const SpinWheel = ({ topic, onCorrect }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  // Cache state: { [amount]: [Question1, Question2, ...] }
  const [questionCache, setQuestionCache] = useState({});
  const [initialLoading, setInitialLoading] = useState(false);

  // Active question logic
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Challenge Logic
  const [score, setScore] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(CHALLENGE_SPINS);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  // AI Modal State
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');

  useMathJax([activeQuestion, feedback]);

  const handleAIExplain = async () => {
    if (!activeQuestion) return;
    setAiOpen(true);
    setAiLoading(true);
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

  const populateCache = async () => {
    setInitialLoading(true);
    try {
        const result = await generateSpinWheelAllAmounts(topic, AMOUNTS);
        if (result) {
            const parsed = JSON.parse(result);
            if (parsed.questions) {
                const newCache = {};
                parsed.questions.forEach(q => {
                    const amt = q.amount;
                    if (!newCache[amt]) newCache[amt] = [];
                    newCache[amt].push(q);
                });
                setQuestionCache(prev => {
                    const merged = { ...prev };
                    Object.keys(newCache).forEach(k => {
                        if (!merged[k]) merged[k] = [];
                        merged[k] = [...merged[k], ...newCache[k]];
                    });
                    return merged;
                });
            }
        }
    } catch (e) {
        console.error("Failed to pre-fetch questions", e);
    }
    setInitialLoading(false);
  };

  const spin = async () => {
    if (isSpinning || spinsLeft <= 0 || gameState !== 'playing') return;
    
    setIsSpinning(true);
    setFeedback(null);
    setActiveQuestion(null);
    setError(null);

    const spinRot = 1800 + Math.floor(Math.random() * 360);
    const finalRot = rotation + spinRot;
    setRotation(finalRot);

    const isCacheEmpty = Object.keys(questionCache).length === 0;
    if (isCacheEmpty) {
       populateCache(); 
    }

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRot = finalRot % 360;
      const segmentAngle = 360 / AMOUNTS.length;
      const effectiveAngle = (360 - normalizedRot) % 360;
      const index = Math.floor(effectiveAngle / segmentAngle);
      const amount = AMOUNTS[index];
      setSelectedAmount(amount);
      
      ensureQuestionAvailable(amount);
    }, 4000);
  };

  const ensureQuestionAvailable = async (amount) => {
    setLoading(true);
    setError(null);

    if (questionCache[amount] && questionCache[amount].length > 0) {
        const q = questionCache[amount][0];
        setQuestionCache(prev => ({
            ...prev,
            [amount]: prev[amount].slice(1)
        }));
        setActiveQuestion(q);
        setLoading(false);
        return;
    }

    try {
        const data = await generateSpinWheelQuestion(topic, amount, 1);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                if (parsed.questions && parsed.questions.length > 0) {
                    const q = parsed.questions[0];
                    setActiveQuestion({...q, amount});
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (e) {
                console.error(e);
                setError("Failed to parse question data.");
            }
        } else {
            setError("Connection timed out or failed. Please try again.");
        }
    } catch (err) {
        setError("Network error occurred.");
    }
    
    setLoading(false);
  };

  const handleNext = () => {
    // Continue with same amount (only if correct)
    setFeedback(null);
    ensureQuestionAvailable(selectedAmount);
  };

  const handleAnswer = (option) => {
    if (!activeQuestion) return;
    
    const isCorrect = option === activeQuestion.correctAnswer;
    const amount = activeQuestion.amount;
    
    setSpinsLeft(prev => prev - 1);
    
    if (isCorrect) {
      setFeedback('correct');
      const newScore = score + amount;
      setScore(newScore);
      if (newScore >= CHALLENGE_TARGET) {
          setGameState('won');
      } else if (spinsLeft - 1 === 0) {
          setGameState('lost');
      }
      
      if (onCorrect) onCorrect();
    } else {
      setFeedback('wrong');
      if (spinsLeft - 1 === 0 && score < CHALLENGE_TARGET) {
          setGameState('lost');
      }
    }
  };

  const closeQuestion = () => {
    setActiveQuestion(null);
    setFeedback(null);
    setError(null);
  };

  const resetGame = () => {
      setScore(0);
      setSpinsLeft(CHALLENGE_SPINS);
      setGameState('playing');
      setQuestionCache({});
      closeQuestion();
  };

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 w-full max-w-5xl">
      
      {/* WHEEL CONTAINER */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex-shrink-0">
        <GhanaFlagPointer />
        <div 
          className={`w-full h-full rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden relative transition-transform duration-[4000ms] cubic-bezier(0.2, 0.8, 0.2, 1) ${gameState !== 'playing' ? 'opacity-50 grayscale' : ''}`}
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
        
        {/* CENTER SPIN BUTTON */}
        <button
          onClick={spin}
          disabled={isSpinning || activeQuestion || gameState !== 'playing'}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full flex items-center justify-center border-4 border-slate-800 z-10 shadow-xl disabled:opacity-80 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all font-bold text-sm text-center leading-tight"
        >
          {isSpinning ? <Loader2 className="animate-spin w-6 h-6" /> : (spinsLeft > 0 ? 'SPIN' : 'DONE')}
        </button>
      </div>

      {/* SCOREBOARD & CHALLENGE INFO */}
      <div className="flex flex-col gap-4 min-w-[240px]">
          <div className="bg-slate-900/80 px-8 py-6 rounded-2xl border border-amber-500/30 flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <Trophy className="w-10 h-10 text-amber-400 mb-2" />
            <p className="text-xs text-amber-500 font-bold uppercase tracking-widest text-center">Current Winnings</p>
            <p className="text-4xl font-black text-white font-mono tracking-tight">GHS {score}</p>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-2"></div>
            {initialLoading && <span className="text-xs text-indigo-400 animate-pulse mt-2">Pre-loading questions...</span>}
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Target Goal:</span>
                <span className="font-bold text-emerald-400">GHS {CHALLENGE_TARGET}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Spins Remaining:</span>
                <span className={`font-bold ${spinsLeft <= 2 ? 'text-rose-400' : 'text-blue-400'}`}>{spinsLeft}</span>
             </div>
             {/* Progress Bar */}
             <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${Math.min((score / CHALLENGE_TARGET) * 100, 100)}%` }}
                ></div>
             </div>
          </div>

          {gameState !== 'playing' && (
              <div className={`p-4 rounded-xl text-center border-2 ${gameState === 'won' ? 'bg-emerald-900/30 border-emerald-500' : 'bg-rose-900/30 border-rose-500'}`}>
                  <h3 className="text-xl font-bold text-white mb-2">{gameState === 'won' ? 'Challenge Complete!' : 'Game Over'}</h3>
                  <p className="text-sm text-slate-300 mb-4">
                      {gameState === 'won' ? `You reached GHS ${score}!` : `You missed the target.`}
                  </p>
                  <button onClick={resetGame} className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                      Play Again
                  </button>
              </div>
          )}
      </div>

      {/* QUESTION MODAL */}
      {(loading || activeQuestion || error) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
            {loading ? (
               <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
                  <p className="text-lg animate-pulse">Consulting the Oracle for a GHS {selectedAmount} question...</p>
               </div>
            ) : error ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                    <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Oops!</h3>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <div className="flex gap-4">
                        <button onClick={closeQuestion} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold">
                            Cancel
                        </button>
                        <button onClick={() => ensureQuestionAvailable(selectedAmount)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">
                            Try Again
                        </button>
                    </div>
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
                                {feedback === 'correct' ? 'Correct! Earnings Updated.' : 'Incorrect!'}
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
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                          >
                             Spin Again
                          </button>
                          
                          {feedback === 'correct' && (
                              <button 
                                onClick={handleNext}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2"
                              >
                                 Next <ArrowRight className="w-4 h-4" />
                              </button>
                          )}
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
