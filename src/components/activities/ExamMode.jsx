import React, { useState } from 'react';
import { List, CheckCircle, XCircle, Loader2, RefreshCcw } from 'lucide-react';
import { generateExamQuestions } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';

const ExamMode = ({ topic, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  useMathJax([questions]);

  const startExam = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    setQuestions([]);
    
    const data = await generateExamQuestions(topic);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.questions) setQuestions(parsed.questions);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      const userAns = answers[q.id]?.trim().toLowerCase();
      const correctAns = q.correctAnswer?.trim().toLowerCase();
      
      // Basic fuzzy matching for short answers could be improved
      if (userAns === correctAns || (q.type === 'mcq' && userAns === correctAns)) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onComplete) onComplete();
  };

  if (!questions.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="bg-slate-800 p-6 rounded-full mb-6">
          <List className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Exam Mode</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Test your knowledge with a generated set of MCQs and Short Answer questions on {topic}.
        </p>
        <button 
          onClick={startExam}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pb-20">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-400">Generating exam questions...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {submitted && (
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl text-center animate-in zoom-in">
              <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Your Score</p>
              <div className="text-5xl font-black text-white mb-2">
                {score} <span className="text-2xl text-slate-500">/ {questions.length}</span>
              </div>
              <button 
                onClick={startExam}
                className="mt-4 flex items-center gap-2 mx-auto text-blue-400 hover:text-blue-300 font-bold"
              >
                <RefreshCcw className="w-4 h-4" /> Try Another Set
              </button>
            </div>
          )}

          {questions.map((q, index) => (
            <div key={q.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl relative">
              <div className="absolute top-4 right-4 text-xs font-bold text-slate-500">
                Q{index + 1}
              </div>
              
              <p className="text-lg text-slate-200 mb-6 pr-8">{q.text}</p>

              {q.type === 'mcq' ? (
                <div className="space-y-3">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    let btnClass = "w-full p-4 rounded-lg border-2 text-left transition-all ";
                    
                    if (submitted) {
                      if (opt === q.correctAnswer) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                      else if (isSelected) btnClass += "bg-rose-500/20 border-rose-500 text-rose-400";
                      else btnClass += "bg-slate-900 border-slate-700 opacity-50";
                    } else {
                      btnClass += isSelected 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "bg-slate-900 border-slate-700 hover:border-blue-500 text-slate-300";
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => !submitted && handleAnswerChange(q.id, opt)}
                        disabled={submitted}
                        className={btnClass}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="relative">
                  <input 
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    disabled={submitted}
                    placeholder="Type your answer..."
                    className={`w-full bg-slate-900 border-2 rounded-lg p-4 outline-none transition-all ${
                      submitted 
                        ? (answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase() 
                            ? "border-emerald-500 text-emerald-400" 
                            : "border-rose-500 text-rose-400")
                        : "border-slate-700 focus:border-blue-500 text-white"
                    }`}
                  />
                  {submitted && (
                    <div className="mt-2 text-sm text-emerald-400">
                      Correct Answer: {q.correctAnswer}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {!submitted && (
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-all"
            >
              Submit Exam
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamMode;
