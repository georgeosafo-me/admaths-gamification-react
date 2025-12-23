import React, { useState, useEffect } from 'react';
import { List, CheckCircle, XCircle, Loader2, RefreshCcw, Sparkles, Clock, HelpCircle } from 'lucide-react';
import { generateExamQuestions, generateConceptExplanation } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';
import AIHelpModal from '../AIHelpModal';

const ExamMode = ({ topic, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(0); // in seconds

  // AI Modal
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiTitle, setAiTitle] = useState('');

  useMathJax([questions, submitted]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleExplain = async (question) => {
    setAiTitle("Kofi Explains: Detailed Solution");
    setAiOpen(true);
    setAiLoading(true);
    try {
        let correctText = question.correctAnswer;
        // If structured, format correctAnswer if it's an object? 
        // Or assume AI returns simple string for simple questions.
        // For structured questions, we might need to handle it.
        // But generateConceptExplanation expects a string prompt.
        const resultJson = await generateConceptExplanation(topic, `Explain the solution for: "${question.text}". Correct Answer(s): ${JSON.stringify(question.correctAnswer || question.steps)}`);
        if (resultJson) {
            const parsed = JSON.parse(resultJson);
            setAiContent(parsed.htmlContent);
        } else {
            setAiContent("No explanation available.");
        }
    } catch (e) {
        setAiContent("Error loading explanation.");
    }
    setAiLoading(false);
  };

  const startExam = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    setQuestions([]);
    
    // 20 questions -> 45 minutes
    setTimeLeft(45 * 60);

    const data = await generateExamQuestions(topic, 20);
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

  const handleAnswerChange = (qId, val, stepIdx = null) => {
    setAnswers(prev => {
      if (stepIdx !== null) {
        // Structured question: answer is an object { [stepIdx]: val }
        const current = prev[qId] || {};
        return { ...prev, [qId]: { ...current, [stepIdx]: val } };
      } else {
        // Simple question
        return { ...prev, [qId]: val };
      }
    });
  };

  const handleMSQChange = (qId, opt) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      if (current.includes(opt)) {
        return { ...prev, [qId]: current.filter(o => o !== opt) };
      } else {
        return { ...prev, [qId]: [...current, opt] };
      }
    });
  };

  const checkStructuredAnswer = (userAnsObj, correctSteps) => {
    if (!userAnsObj) return false;
    // Check if every step is roughly correct
    // This is hard for AI to grade strictly. We'll do simple normalization.
    // Or we can just count it as correct if they filled something? No.
    // Let's compare normalized strings.
    let correctCount = 0;
    correctSteps.forEach((step, idx) => {
      const userVal = (userAnsObj[idx] || '').toString().trim().toLowerCase();
      const correctVal = (step.answer || '').toString().trim().toLowerCase();
      if (userVal === correctVal) correctCount++;
    });
    // Strict: all steps must be correct? Or partial?
    // Let's say all.
    return correctCount === correctSteps.length;
  };

  const checkMSQAnswer = (userAnsArr, correctAnsArr) => {
    if (!userAnsArr || !Array.isArray(userAnsArr)) return false;
    if (userAnsArr.length !== correctAnsArr.length) return false;
    const sortedUser = [...userAnsArr].sort();
    const sortedCorrect = [...correctAnsArr].sort();
    return sortedUser.every((val, index) => val === sortedCorrect[index]);
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      if (q.type === 'structured') {
        if (checkStructuredAnswer(answers[q.id], q.steps)) correct++;
      } else if (q.type === 'msq') {
        if (checkMSQAnswer(answers[q.id], q.correctAnswer)) correct++;
      } else {
        // MCQ, Boolean, Simple text
        const userAns = (answers[q.id] || '').toString().trim().toLowerCase();
        const correctAns = (q.correctAnswer || '').toString().trim().toLowerCase();
        if (userAns === correctAns) correct++;
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
          Take a comprehensive 20-question exam on {topic}. Includes mixed formats and multi-step problems.
        </p>
        <button 
          onClick={startExam}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          Start Exam (45 Mins)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-400">Generating exam papers...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Header & Timer */}
          <div className="sticky top-20 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-700 pb-4 mb-8 flex justify-between items-center px-4 -mx-4 md:px-0 md:mx-0">
             <h2 className="text-lg font-bold text-white truncate max-w-[200px]">{topic} Exam</h2>
             <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${timeLeft < 300 ? 'bg-rose-900/50 text-rose-400 animate-pulse' : 'bg-slate-800 text-emerald-400'}`}>
                <Clock className="w-4 h-4" />
                {submitted ? 'Finished' : formatTime(timeLeft)}
             </div>
          </div>

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

          {/* Instructions */}
          {!submitted && (
             <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-3 text-sm text-blue-200">
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                   <p className="font-bold mb-1">Instructions:</p>
                   <ul className="list-disc pl-4 space-y-1 opacity-80">
                      <li>Use <b>/</b> for fractions (e.g., 1/2).</li>
                      <li>For multiple choice, select one. For multiple selection, check all that apply.</li>
                      <li>For structured questions, fill in each step box.</li>
                   </ul>
                </div>
             </div>
          )}

          {questions.map((q, index) => (
            <div key={q.id || index} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl relative">
              <div className="absolute top-4 right-4 text-xs font-bold text-slate-500">
                Q{index + 1}
              </div>
              
              {/* Question Text */}
              <div className="text-lg text-slate-200 mb-6 pr-8 math-content">
                 {q.text || q.question}
              </div>

              {/* Render based on Type */}
              {q.type === 'mcq' || q.type === 'boolean' ? (
                <div className="space-y-3">
                  {(q.options || ['True', 'False']).map((opt) => {
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
              ) : q.type === 'msq' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-2">Select all that apply:</p>
                  {(q.options || []).map((opt) => {
                    const isSelected = (answers[q.id] || []).includes(opt);
                    let btnClass = "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ";
                    
                    if (submitted) {
                      const isCorrect = (q.correctAnswer || []).includes(opt);
                      if (isCorrect) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                      else if (isSelected) btnClass += "bg-rose-500/20 border-rose-500 text-rose-400";
                      else btnClass += "bg-slate-900 border-slate-700 opacity-50";
                    } else {
                      btnClass += isSelected 
                        ? "bg-blue-600/20 border-blue-500 text-blue-200" 
                        : "bg-slate-900 border-slate-700 hover:border-blue-500 text-slate-300";
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => !submitted && handleMSQChange(q.id, opt)}
                        disabled={submitted}
                        className={btnClass}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                           {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : q.type === 'structured' ? (
                <div className="space-y-4">
                   <p className="text-xs text-slate-400 uppercase font-bold mb-2">Step-by-step Solution:</p>
                   {q.steps && q.steps.map((step, sIdx) => {
                      const userStepVal = (answers[q.id] || {})[sIdx] || '';
                      // Simple feedback for step: compare normalized
                      const isStepCorrect = userStepVal.toString().trim().toLowerCase() === (step.answer || '').toString().trim().toLowerCase();
                      
                      return (
                        <div key={sIdx} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                           <label className="block text-sm font-bold text-slate-400 mb-2">{step.label}</label>
                           <input 
                              type="text"
                              value={userStepVal}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value, sIdx)}
                              disabled={submitted}
                              placeholder="Enter result..."
                              className={`w-full bg-slate-800 border-2 rounded-lg p-3 outline-none transition-all ${
                                submitted 
                                  ? (isStepCorrect 
                                      ? "border-emerald-500 text-emerald-400" 
                                      : "border-rose-500 text-rose-400")
                                  : "border-slate-600 focus:border-blue-500 text-white"
                              }`}
                           />
                           {submitted && !isStepCorrect && (
                              <p className="text-xs text-emerald-500 mt-1">Expected: {step.answer}</p>
                           )}
                        </div>
                      );
                   })}
                </div>
              ) : (
                // Fallback for simple fill-in
                <div className="relative">
                  <input 
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    disabled={submitted}
                    placeholder="Type your answer..."
                    className={`w-full bg-slate-900 border-2 rounded-lg p-4 outline-none transition-all ${
                      submitted 
                        ? ((answers[q.id] || '').toLowerCase() === (q.correctAnswer || '').toLowerCase()
                            ? "border-emerald-500 text-emerald-400" 
                            : "border-rose-500 text-rose-400")
                        : "border-slate-700 focus:border-blue-500 text-white"
                    }`}
                  />
                </div>
              )}

              {/* Explainer Button (Only when submitted) */}
              {submitted && (
                 <div className="mt-4 flex justify-end">
                    <button 
                        onClick={() => handleExplain(q)}
                        className="text-xs flex items-center gap-1 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full transition-colors font-bold"
                      >
                        <Sparkles className="w-4 h-4" /> Kofi Explains
                    </button>
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
      <AIHelpModal 
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        title={aiTitle}
        content={aiContent}
        loading={aiLoading}
      />
    </div>
  );
};

export default ExamMode;
