import React, { useState } from 'react';
import { XOctagon, Check, AlertTriangle } from 'lucide-react';
import { generateErrorCorrection } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';

const ErrorCorrection = ({ topic, onCorrect }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useMathJax([data]);

  const loadProblem = async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedStep(null);
    const res = await generateErrorCorrection(topic);
    if (res) setData(JSON.parse(res));
    setLoading(false);
  };

  const handleSelect = (id) => {
    if (feedback === 'correct') return;
    setSelectedStep(id);
    if (id === data.errorStepId) {
      setFeedback('correct');
      if (onCorrect) onCorrect();
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {!data ? (
        <div className="text-center py-20">
          <button onClick={loadProblem} disabled={loading} className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold shadow-lg">
            {loading ? 'Planting Errors...' : 'Find the Mistake'}
          </button>
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
            <XOctagon className="w-12 h-12 text-rose-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">{data.problem}</h3>
            <p className="text-slate-400">Click the step that contains an error.</p>
          </div>

          <div className="space-y-4 mb-8">
            {data.steps.map((step) => {
              let statusClass = "border-slate-700 bg-slate-800 hover:bg-slate-700";
              if (selectedStep === step.id) {
                if (feedback === 'correct') statusClass = "border-emerald-500 bg-emerald-900/20";
                else if (feedback === 'wrong') statusClass = "border-rose-500 bg-rose-900/20";
              }

              return (
                <button
                  key={step.id}
                  onClick={() => handleSelect(step.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${statusClass}`}
                >
                  <span className="font-mono text-slate-500 mr-4">Step {step.id}</span>
                  <span className="text-slate-200">{step.text}</span>
                </button>
              );
            })}
          </div>

          {feedback === 'correct' && (
            <div className="p-6 bg-slate-800 border border-emerald-500 rounded-xl animate-in zoom-in">
              <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <Check className="w-5 h-5" /> Well Spotted!
              </h4>
              <p className="text-slate-300">{data.correction}</p>
              <button onClick={loadProblem} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorCorrection;
