import React, { useState, useEffect } from 'react';
import { RefreshCcw, CheckCircle, ArrowRight } from 'lucide-react';
import { generateRearrange } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';

const Rearrange = ({ topic, onCorrect }) => {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [success, setSuccess] = useState(false);

  const data = queue[currentIndex];

  useMathJax([shuffledSteps]);

  // When data changes (new problem), shuffle steps
  useEffect(() => {
    if (data) {
      const shuffled = [...data.steps].sort(() => Math.random() - 0.5);
      setShuffledSteps(shuffled);
      setSuccess(false);
    }
  }, [data]);

  const loadBatch = async (initial = false) => {
    setLoading(true);
    const res = await generateRearrange(topic, 5);
    if (res) {
      try {
        const parsed = JSON.parse(res);
        if (parsed.sets) {
          if (initial) {
            setQueue(parsed.sets);
            setCurrentIndex(0);
          } else {
            setQueue(prev => [...prev, ...parsed.sets]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  const handleNext = () => {
    setSuccess(false);
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      loadBatch(false).then(() => {
         setCurrentIndex(prev => prev + 1);
      });
    }
  };

  const moveStep = (fromIndex, toIndex) => {
    if (success) return;
    const newSteps = [...shuffledSteps];
    const [moved] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, moved);
    setShuffledSteps(newSteps);
  };

  const checkOrder = () => {
    // Check if current order matches original IDs
    const isCorrect = shuffledSteps.every((step, index) => step.id === data.steps[index].id);
    if (isCorrect) {
      setSuccess(true);
      if (onCorrect) onCorrect();
    } else {
      alert("Not quite right yet. Keep trying!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {!data ? (
        <div className="text-center py-20">
          <button onClick={() => loadBatch(true)} disabled={loading} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg">
            {loading ? 'Generating...' : 'Start Rearrangement Challenge'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Problem {currentIndex + 1}
             </span>
             {loading && <span className="text-xs text-blue-400 animate-pulse">Loading more...</span>}
          </div>

          <h3 className="text-xl font-bold text-slate-300 mb-6 text-center">{data.problem}</h3>
          
          <div className="space-y-3 mb-8">
            {shuffledSteps.map((step, index) => (
              <div key={step.id} className="flex gap-4 items-center">
                <div className="flex-col gap-1 hidden md:flex">
                   <button onClick={() => index > 0 && moveStep(index, index-1)} className={`text-slate-500 hover:text-white ${success ? 'opacity-0' : ''}`}>▲</button>
                   <button onClick={() => index < shuffledSteps.length-1 && moveStep(index, index+1)} className={`text-slate-500 hover:text-white ${success ? 'opacity-0' : ''}`}>▼</button>
                </div>
                <div className="flex-1 p-4 bg-slate-800 border border-slate-700 rounded-xl cursor-move active:bg-slate-700 transition-colors">
                  {step.text}
                </div>
              </div>
            ))}
          </div>

          {!success ? (
            <button onClick={checkOrder} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold">
              Check Order
            </button>
          ) : (
            <div className="text-center p-6 bg-emerald-900/30 border border-emerald-500 rounded-xl">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-emerald-400">Perfect Sequence!</h3>
              <button onClick={handleNext} className="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 mx-auto">
                 Next Challenge <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rearrange;
