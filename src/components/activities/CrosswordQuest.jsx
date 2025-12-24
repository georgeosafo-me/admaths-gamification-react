import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Calculator, HelpCircle, Target, Loader2, RefreshCcw, Layers } from 'lucide-react';
import { TEMPLATES } from '../../data/crosswordTemplates';
import { callGemini, callGeminiTTS, generateCrossword } from '../../utils/aiLogic';
import ChallengeCard from './ChallengeCard';
import AIHelpModal from '../AIHelpModal';

const CrosswordQuest = ({ topic, onComplete }) => {
  // --- STATE ---
  const [answers, setAnswers] = useState({});
  const [missionData, setMissionData] = useState(null);
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Grid State
  const [currentTemplate, setCurrentTemplate] = useState(TEMPLATES[0]);

  // Derived State (based on difficulty)
  const currentSolution = missionData?.[difficulty]?.solution || {};
  const currentClues = missionData?.[difficulty]?.clues || { across: [], down: [] };

  // AI State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiTitle, setAiTitle] = useState('');
  
  // Audio State
  const [playingClueId, setPlayingClueId] = useState(null);
  const audioRef = useRef(null);

  // --- MATHJAX CONFIGURATION & LOADING ---
  useEffect(() => {
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
      },
      svg: {
        fontCache: 'global'
      }
    };

    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      setTimeout(() => {
        window.MathJax.typesetPromise();
      }, 100);
    }
  }, [aiResponse, aiModalOpen, currentClues, difficulty]);

  // --- ACTIONS ---

  const generateNewPuzzle = async () => {
    setIsGenerating(true);
    setAnswers({}); 
    setShowSuccess(false);

    // 1. Randomly select a template
    const randomTemplateIndex = Math.floor(Math.random() * TEMPLATES.length);
    const nextTemplate = TEMPLATES[randomTemplateIndex];

    const jsonString = await generateCrossword(topic, nextTemplate.aiInstructions);
    
    if (jsonString) {
      try {
        const newData = JSON.parse(jsonString);
        if (newData.easy && newData.medium && newData.hard) {
            setMissionData(newData);
            setCurrentTemplate(nextTemplate); // Switch the visual grid
            setDifficulty('easy'); // Reset to easy on new generation
        } else {
            throw new Error("Invalid JSON structure");
        }
      } catch (e) {
        console.error("Failed to parse puzzle", e);
        setAiTitle("Data Error");
        setAiResponse("The generated mission data was corrupted. Please try again.");
        setAiModalOpen(true);
      }
    } else {
        setAiTitle("Connection Error");
        setAiResponse("Could not reach the Mission Control server. Please try again.");
        setAiModalOpen(true);
    }
    
    setIsGenerating(false);
  };

  const handleSmartHint = async (clue) => {
    setAiTitle(`✨ Smart Hint: Clue #${clue.number}`);
    setAiResponse('');
    setAiLoading(true);
    setAiModalOpen(true);

    const prompt = `You are an encouraging high school geometry tutor. 
    The student is stuck on this crossword clue: "${clue.text}".
    The concept is: "${clue.question}".
    The static hint they already have is: "${clue.hint}".
    
    Provide a short, progressive hint (max 2 sentences) that helps them visualize the problem or think about the next step. 
    DO NOT give the answer. 
    
    IMPORTANT FORMATTING:
    - Output basic HTML (e.g., use <b> for emphasis).
    - Use LaTeX for ALL math notation.
    - WRAP ALL MATH IN SINGLE DOLLAR SIGNS: $y = mx + b$.
    - NEVER use double dollar signs or block brackets.`;

    const result = await callGemini(prompt, false);
    setAiResponse(result || "AI is taking a nap. Try again.");
    setAiLoading(false);
  };

  const handleExplainConcept = async (clue) => {
    setAiTitle(`✨ Concept Guide: ${clue.question}`);
    setAiResponse('');
    setAiLoading(true);
    setAiModalOpen(true);

    const prompt = `Explain the mathematical concept of "${clue.question}" to a high school student.
    Use the context of this problem: "${clue.text}" as an example.
    Explain the formula or logic needed to solve it clearly and simply.
    Keep the explanation under 80 words.
    
    IMPORTANT FORMATTING:
    - Output basic HTML.
    - Use LaTeX for ALL math notation.
    - WRAP ALL MATH IN SINGLE DOLLAR SIGNS: $\\sqrt{x_2 - x_1}$.
    - NEVER use double dollar signs or block brackets.`;

    const result = await callGemini(prompt, false);
    setAiResponse(result || "AI is taking a nap. Try again.");
    setAiLoading(false);
  };

  const handleReadAloud = async (clue, id) => {
    if (playingClueId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingClueId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlayingClueId(id); 

    const wavBlob = await callGeminiTTS(clue.text);

    if (wavBlob) {
      const audioUrl = URL.createObjectURL(wavBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlayingClueId(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
    } else {
      setPlayingClueId(null); 
    }
  };

  const handleInputChange = (r, c, val) => {
    if (!/^\d*$/.test(val)) return;
    const key = `${r}-${c}`;
    const newAnswers = { ...answers, [key]: val.slice(-1) }; 
    setAnswers(newAnswers);
    const isComplete = Object.keys(currentSolution).every(k => newAnswers[k] === currentSolution[k]);
    if (isComplete) {
      setShowSuccess(true);
      if (onComplete) onComplete();
    }
  };

  const getCellStatus = (r, c) => {
    const key = `${r}-${c}`;
    const val = answers[key];
    if (!val) return 'empty';
    return val === currentSolution[key] ? 'correct' : 'wrong';
  };

  const handleDifficultyChange = (newDiff) => {
      setDifficulty(newDiff);
      setAnswers({});
      setShowSuccess(false);
  };

  if (!missionData) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full">
            <Target className="w-16 h-16 text-slate-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-300 mb-4">Math Crossword: {topic}</h2>
            <p className="text-slate-500 mb-8 max-w-md">
                Solve math problems to unlock the grid. Correct answers reveal digits needed to complete the crossword.
            </p>
            <button
                onClick={generateNewPuzzle}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Missions...
                    </>
                ) : (
                    <>
                        <RefreshCcw className="w-5 h-5" />
                        Start Mission
                    </>
                )}
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans relative flex flex-col">
      <style>{`
        .math-content mjx-container {
          display: inline-block !important;
          margin: 0 !important;
          vertical-align: middle;
        }
      `}</style>

      {/* AI HELP MODAL */}
      <AIHelpModal 
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiTitle}
        content={aiResponse}
        loading={aiLoading}
      />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        {/* LEFT COLUMN: GAME BOARD */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                  <Target className="w-6 h-6" /> Mission: {topic}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {currentTemplate.name}
                </p>
              </div>
              <div className="bg-slate-900 p-3 rounded-full border border-slate-700 self-end md:self-auto">
                {showSuccess ? <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" /> : <Calculator className="w-6 h-6 text-blue-400" />}
              </div>
            </header>

            {/* DIFFICULTY CONTROLS */}
            <div className="flex bg-slate-900 p-1 rounded-lg mb-6 border border-slate-700">
                <button 
                  onClick={() => handleDifficultyChange('easy')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${difficulty === 'easy' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    Level 1 (Basic)
                </button>
                <button 
                  onClick={() => handleDifficultyChange('medium')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${difficulty === 'medium' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    Level 2 (Applied)
                </button>
                <button 
                  onClick={() => handleDifficultyChange('hard')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${difficulty === 'hard' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    Level 3 (DoK 3)
                </button>
            </div>

            {/* THE GRID */}
            <div className="flex justify-center bg-slate-900 p-8 rounded-xl relative overflow-hidden shadow-inner">
               {showSuccess && (
                  <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20 backdrop-blur-sm transition-all duration-500">
                    <div className="text-center animate-in fade-in zoom-in duration-300 p-6 bg-slate-800 border border-emerald-500/50 rounded-2xl shadow-2xl">
                      <p className="text-4xl mb-3">🎉</p>
                      <h3 className="text-2xl font-bold text-white mb-1">Mission Accomplished!</h3>
                      <p className="text-emerald-400 font-mono">Target Coordinates Acquired.</p>
                      
                      {difficulty !== 'hard' ? (
                          <button 
                             onClick={() => handleDifficultyChange(difficulty === 'easy' ? 'medium' : 'hard')}
                             className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors flex items-center gap-2 mx-auto"
                          >
                             <Layers className="w-5 h-5" /> Next Level
                          </button>
                      ) : (
                          <button 
                             onClick={generateNewPuzzle}
                             className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors flex items-center gap-2 mx-auto"
                          >
                             <RefreshCcw className="w-5 h-5" /> New Mission
                          </button>
                      )}
                    </div>
                  </div>
               )}

               <div className="grid grid-cols-5 gap-2 w-full max-w-[320px] aspect-square">
                 {currentTemplate.layout.map((row, rIndex) => (
                   row.map((cellType, cIndex) => {
                     const key = `${rIndex}-${cIndex}`;
                     const num = currentTemplate.cellNumbers[key];
                     const status = getCellStatus(rIndex, cIndex);
                     
                     if (cellType === 0) {
                       return <div key={key} className="bg-slate-800/30 rounded-md" />;
                     }

                     return (
                       <div key={key} className="relative aspect-square transition-transform hover:scale-105">
                         {num && (
                           <span className="absolute top-1 left-1.5 text-[11px] text-slate-400 font-bold z-10 font-mono">
                             {num}
                           </span>
                         )}
                         <input
                           type="text"
                           inputMode="numeric"
                           maxLength={1}
                           value={answers[key] || ''}
                           onChange={(e) => handleInputChange(rIndex, cIndex, e.target.value)}
                           className={`
                             w-full h-full text-center text-3xl font-bold rounded-lg border-2 transition-all outline-none 
                             ${status === 'correct' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : ''}
                             ${status === 'wrong' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : ''}
                             ${status === 'empty' ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-400 focus:bg-slate-600' : ''}
                           `}
                         />
                       </div>
                     );
                   })
                 ))}
               </div>
            </div>

            {/* GENERATE BUTTON */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={generateNewPuzzle}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating 3x Missions...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="w-5 h-5" />
                    Generate New Mission Set
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-slate-500 mt-2">Generates Basic, Applied, and Complex variants at once.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: CLUES */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 h-full flex flex-col">
            <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
              <HelpCircle className="w-5 h-5" /> Mission Protocols ({difficulty.toUpperCase()})
            </h2>

            <ChallengeCard 
              clues={currentClues}
              playingClueId={playingClueId}
              handleReadAloud={handleReadAloud}
              handleSmartHint={handleSmartHint}
              handleExplainConcept={handleExplainConcept}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrosswordQuest;
