import React, { useState } from 'react';
import { HelpCircle, Lightbulb, Check, X, Sparkles } from 'lucide-react';
import { generateRiddle, generateConceptExplanation } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';
import AIHelpModal from '../AIHelpModal';

const Riddle = ({ topic, onCorrect }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // AI Modal
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');

  useMathJax([data]);

  const handleExplain = async () => {
    setAiOpen(true);
    setAiLoading(true);
    try {
        const resultJson = await generateConceptExplanation(topic, `Explain the logic behind this riddle: "${data.riddle}". Answer is "${data.answer}".`);
        if (resultJson) {
            const parsed = JSON.parse(resultJson);
            setAiContent(parsed.htmlContent);
        }
    } catch (e) {
        setAiContent("Error.");
    }
    setAiLoading(false);
  };

  const loadRiddle = async () => {
    setLoading(true);
    setFeedback(null);
    setAnswer('');
    setShowHint(false);
    const res = await generateRiddle(topic);
    if (res) setData(JSON.parse(res));
    setLoading(false);
  };

  const checkAnswer = () => {
    if (!data) return;
    if (answer.toLowerCase().includes(data.answer.toLowerCase())) {
      setFeedback('correct');
      if (onCorrect) onCorrect();
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      {!data ? (
        <div className="py-20">
          <button 
            onClick={loadRiddle} 
            disabled={loading}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold shadow-lg text-xl"
          >
            {loading ? 'Thinking...' : 'Get a Riddle'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <HelpCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">"{data.riddle}"</h3>
          
          <div className="mb-6">
            <input 
              type="text" 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="What am I?" 
              className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-center text-lg text-white focus:border-purple-500 outline-none"
            />
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button onClick={checkAnswer} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold">Check</button>
            <button onClick={() => setShowHint(true)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Hint
            </button>
            <button onClick={loadRiddle} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors">
              Next Riddle
            </button>
          </div>

          {showHint && <p className="text-amber-400 italic mb-4 animate-in fade-in">Hint: {data.hint}</p>}

          {feedback === 'correct' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-xl text-emerald-400 font-bold flex items-center justify-center gap-2">
                <Check className="w-6 h-6" /> Correct! It's {data.answer}.
              </div>
              <button onClick={handleExplain} className="text-sm text-indigo-400 flex items-center justify-center gap-2 hover:text-white">
                 <Sparkles className="w-4 h-4" /> Explain the logic
              </button>
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="p-4 bg-rose-900/30 border border-rose-500/50 rounded-xl text-rose-400 font-bold flex items-center justify-center gap-2">
              <X className="w-6 h-6" /> Not quite. Try again!
            </div>
          )}
        </div>
      )}
      <AIHelpModal 
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        title="Riddle Logic"
        content={aiContent}
        loading={aiLoading}
      />
    </div>
  );
};

export default Riddle;
