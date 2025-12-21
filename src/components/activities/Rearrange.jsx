import React, { useState, useEffect } from 'react';
import { RefreshCcw, CheckCircle } from 'lucide-react';
import { generateRearrange } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';

const Rearrange = ({ topic, onCorrect }) => {
  const [data, setData] = useState(null);
  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useMathJax([shuffledSteps]);

  const loadProblem = async () => {
    setLoading(true);
    setSuccess(false);
    const res = await generateRearrange(topic);
    if (res) {
      const parsed = JSON.parse(res);
      setData(parsed);
      // Shuffle steps
      const shuffled = [...parsed.steps].sort(() => Math.random() - 0.5);
      setShuffledSteps(shuffled);
    }
    setLoading(false);
  };

  const moveStep = (fromIndex, toIndex) => {
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
          <button onClick={loadProblem} disabled={loading} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg">
            {loading ? 'Generating...' : 'Start Rearrangement Challenge'}
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold text-slate-300 mb-6 text-center">{data.problem}</h3>
          
          <div className="space-y-3 mb-8">
            {shuffledSteps.map((step, index) => (
              <div key={step.id} className="flex gap-4 items-center">
                <div className="flex-col gap-1 hidden md:flex">
                   <button onClick={() => index > 0 && moveStep(index, index-1)} className="text-slate-500 hover:text-white">▲</button>
                   <button onClick={() => index < shuffledSteps.length-1 && moveStep(index, index+1)} className="text-slate-500 hover:text-white">▼</button>
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
              <button onClick={loadProblem} className="mt-4 text-white underline">Try Another</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rearrange;
