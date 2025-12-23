import React, { useState } from 'react';
import { Maximize, Target, ArrowRight } from 'lucide-react';
import { generateHotspot } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';

const Hotspot = ({ topic, onCorrect }) => {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Logic State
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', 'revealed'
  const [selectedOption, setSelectedOption] = useState(null);

  const data = queue[currentIndex];

  useMathJax([data, feedback]);

  const loadBatch = async (initial = false) => {
    setLoading(true);
    // Fetch 5 problems
    const res = await generateHotspot(topic, 5);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        if (parsed.challenges) {
          if (initial) {
            setQueue(parsed.challenges);
            setCurrentIndex(0);
          } else {
            setQueue(prev => [...prev, ...parsed.challenges]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  const handleNext = () => {
    setFeedback(null);
    setWrongAttempts(0);
    setSelectedOption(null);
    
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Load more if at end
      loadBatch(false).then(() => {
         setCurrentIndex(prev => prev + 1);
      });
    }
  };

  const handleSelect = (opt) => {
    if (feedback === 'correct' || feedback === 'revealed') return;
    
    setSelectedOption(opt);

    if (opt === data.correctAnswer) {
      setFeedback('correct');
      if (onCorrect) onCorrect();
    } else {
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);
      
      if (newAttempts >= 2) {
        setFeedback('revealed');
      } else {
        setFeedback('wrong');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      {!data ? (
        <div className="py-20">
          <button 
            onClick={() => loadBatch(true)} 
            disabled={loading} 
            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold shadow-lg"
          >
            {loading ? 'Visualizing...' : 'Start Visual Challenge'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
          <div className="flex justify-between items-center mb-6">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Problem {currentIndex + 1}
             </span>
             {loading && <span className="text-xs text-orange-400 animate-pulse">Loading more...</span>}
          </div>

          <Maximize className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          
          <div className="mb-8 p-6 bg-slate-900 rounded-xl border border-slate-800 italic text-slate-300">
            {data.description}
          </div>

          <h3 className="text-xl font-bold text-white mb-6">{data.question}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.options.map((opt) => {
              let btnClass = "p-4 rounded-xl border-2 font-bold transition-all ";
              
              if (feedback === 'correct') {
                 if (opt === data.correctAnswer) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                 else btnClass += "opacity-50 border-slate-700";
              } else if (feedback === 'revealed') {
                 if (opt === data.correctAnswer) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                 else if (opt === selectedOption) btnClass += "bg-rose-500/20 border-rose-500 text-rose-400";
                 else btnClass += "opacity-50 border-slate-700";
              } else if (feedback === 'wrong') {
                 if (opt === selectedOption) btnClass += "bg-rose-500/20 border-rose-500 text-rose-400";
                 else btnClass += "bg-slate-700 border-slate-600 hover:border-orange-500";
              } else {
                 btnClass += "bg-slate-700 border-slate-600 hover:border-orange-500 hover:bg-slate-600";
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={feedback === 'correct' || feedback === 'revealed'}
                  className={btnClass}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {feedback === 'correct' && (
            <div className="mt-6 p-4 bg-emerald-900/30 text-emerald-400 font-bold rounded-xl animate-in zoom-in">
              Correct identification!
              <button onClick={handleNext} className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2 mx-auto">
                 Next Visual <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {feedback === 'revealed' && (
            <div className="mt-6 p-4 bg-slate-700/50 border border-slate-600 rounded-xl animate-in fade-in">
              <p className="text-rose-400 font-bold mb-2">Incorrect.</p>
              <p className="text-slate-300 text-sm mb-4">{data.explanation || "Review the description carefully."}</p>
              <div className="text-emerald-400 font-bold mb-4">Correct Answer: {data.correctAnswer}</div>
              <button onClick={handleNext} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-bold flex items-center gap-2 mx-auto">
                 Next Visual <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {feedback === 'wrong' && (
             <p className="mt-4 text-rose-400 font-bold animate-pulse">Try again!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Hotspot;
