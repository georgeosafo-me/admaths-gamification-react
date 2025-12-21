import React, { useState } from 'react';
import { Maximize, Target } from 'lucide-react';
import { generateHotspot } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';

const Hotspot = ({ topic, onCorrect }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useMathJax([data]);

  const loadProblem = async () => {
    setLoading(true);
    setFeedback(null);
    const res = await generateHotspot(topic);
    if (res) setData(JSON.parse(res));
    setLoading(false);
  };

  const handleSelect = (opt) => {
    if (feedback) return;
    if (opt === data.correctAnswer) {
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
          <button onClick={loadProblem} disabled={loading} className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold shadow-lg">
            {loading ? 'Visualizing...' : 'Start Visual Challenge'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
          <Maximize className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          
          <div className="mb-8 p-6 bg-slate-900 rounded-xl border border-slate-800 italic text-slate-300">
            {data.description}
          </div>

          <h3 className="text-xl font-bold text-white mb-6">{data.question}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={!!feedback}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  feedback && opt === data.correctAnswer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                  feedback && opt !== data.correctAnswer ? 'opacity-50 border-slate-700' :
                  'bg-slate-700 border-slate-600 hover:border-orange-500 hover:bg-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback === 'correct' && (
            <div className="mt-6 p-4 bg-emerald-900/30 text-emerald-400 font-bold rounded-xl animate-in zoom-in">
              Correct identification!
              <button onClick={loadProblem} className="block mt-2 mx-auto text-sm underline text-white">Next Visual</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Hotspot;
