import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Loader2, ArrowRight, AlertCircle, Search, Lightbulb, CheckCircle, Play } from 'lucide-react';
import { generateConceptExplanation } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';
import { CURRICULUM } from '../../data/curriculum';

const ConceptExplainer = ({ topic, topicId, onExplain, onSwitchActivity }) => {
  const [concept, setConcept] = useState('');
  const [data, setData] = useState(null); // { htmlContent, svg, suggestions, related, message, scaffolding, recommendations }
  const [loading, setLoading] = useState(false);
  const [subTopics, setSubTopics] = useState([]);

  // Scaffolding State
  const [scaffoldInput, setScaffoldInput] = useState('');
  const [scaffoldFeedback, setScaffoldFeedback] = useState('idle'); // 'idle', 'correct', 'wrong'

  // We need to trigger MathJax when data changes
  useMathJax([data, scaffoldFeedback]);

  // Load sub-topics on mount or when topic changes
  useEffect(() => {
    let allSubStrands = [];
    Object.values(CURRICULUM).forEach(strand => {
      allSubStrands = [...allSubStrands, ...strand.subStrands];
    });
    
    // Attempt to match topic by ID (preferred) or Title (fallback)
    let match = null;
    if (topicId) {
        match = allSubStrands.find(s => s.id === topicId);
    } 
    if (!match) {
        match = allSubStrands.find(s => s.title === topic);
    }

    if (match && match.topics) {
      setSubTopics(match.topics);
    } else {
      setSubTopics([]);
    }
    
    // Reset data when topic changes
    setData(null);
    setConcept('');
  }, [topic, topicId]);

  const handleExplain = async (e, customTopic) => {
    if (e) e.preventDefault();
    const targetConcept = customTopic || concept;
    if (!targetConcept.trim()) return;

    setLoading(true);
    setConcept(targetConcept); 
    setData(null);
    setScaffoldInput('');
    setScaffoldFeedback('idle');
    
    try {
      const resultJson = await generateConceptExplanation(topic, targetConcept);
      if (resultJson) {
        const parsed = JSON.parse(resultJson);
        setData(parsed);
        if (parsed.related && onExplain) onExplain();
      }
    } catch (err) {
      console.error(err);
      setData({ htmlContent: "<p>Sorry, I couldn't generate an explanation right now.</p>", suggestions: [] });
    }
    setLoading(false);
  };

  const checkScaffold = () => {
    if (!data?.scaffolding?.activity) return;
    const correct = data.scaffolding.activity.answer.trim().toLowerCase();
    const user = scaffoldInput.trim().toLowerCase();
    
    // Simple lenient check
    if (user === correct || user.includes(correct) || correct.includes(user)) {
        setScaffoldFeedback('correct');
    } else {
        setScaffoldFeedback('wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
          AI Concept Tutor
        </h2>
        <p className="text-slate-400">Ask about any concept in <span className="text-emerald-400 font-bold">{topic}</span>.</p>
      </div>

      <form onSubmit={(e) => handleExplain(e)} className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder={`Search concepts in ${topic}...`}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !concept.trim()}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Explain
        </button>
      </form>

      {/* IMPORTANT SUB-TOPICS LIST (Shown if no data yet) */}
      {!data && !loading && subTopics.length > 0 && (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 text-center">
            Important Topics in {topic}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subTopics.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => handleExplain(null, sub)}
                className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-300 group-hover:text-white">{sub}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT AREA */}
      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          {/* UNRELATED SEARCH WARNING */}
          {data.related === false ? (
             <div className="bg-amber-900/20 border border-amber-500/50 p-6 rounded-2xl flex items-start gap-4">
               <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
               <div>
                 <h3 className="text-lg font-bold text-amber-400 mb-2">Keep on Topic!</h3>
                 <p className="text-slate-300">
                   {data.message || `That doesn't seem related to ${topic}. Please search for something else within this topic.`}
                 </p>
                 {subTopics.length > 0 && (
                   <div className="mt-4">
                     <p className="text-xs text-slate-500 uppercase font-bold mb-2">Try these instead:</p>
                     <div className="flex flex-wrap gap-2">
                       {subTopics.slice(0, 3).map((s, i) => (
                         <button key={i} onClick={() => handleExplain(null, s)} className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full text-slate-300">
                           {s}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             </div>
          ) : (
            <>
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Explanation: {concept}</h3>
                </div>
                
                {/* SVG Diagram if available */}
                {data.svg && (
                  <div className="mb-6 p-4 bg-slate-900 rounded-xl border border-slate-700 flex justify-center">
                    <div dangerouslySetInnerHTML={{ __html: data.svg }} className="w-full max-w-md" />
                  </div>
                )}

                <div 
                  className="prose prose-lg prose-invert max-w-none 
                    prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-headings:text-emerald-300 
                    prose-strong:text-indigo-400 prose-strong:font-bold
                    prose-ul:text-slate-300 prose-li:marker:text-emerald-500
                    prose-code:text-amber-300 prose-code:bg-slate-900/50 prose-code:px-1 prose-code:rounded
                  "
                  dangerouslySetInnerHTML={{ __html: data.htmlContent }}
                />
              </div>

              {/* SCAFFOLDING ACTIVITY */}
              {data.scaffolding && (
                  <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 overflow-hidden shadow-lg">
                      <div className="bg-indigo-900/20 p-4 border-b border-indigo-500/30 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-400" />
                          <h3 className="font-bold text-indigo-300">Let's Build Intuition</h3>
                      </div>
                      <div className="p-6 space-y-6">
                          {/* Analogy */}
                          <div className="bg-slate-800 p-4 rounded-xl text-slate-300 italic border border-slate-700">
                              "{data.scaffolding.analogy}"
                          </div>

                          {/* Activity */}
                          <div className="space-y-4">
                              <p className="font-bold text-white text-sm uppercase tracking-wide">Walkthrough:</p>
                              <ul className="space-y-2">
                                  {data.scaffolding.activity.steps.map((step, idx) => (
                                      <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">{idx + 1}</span>
                                          {step}
                                      </li>
                                  ))}
                              </ul>
                              
                              <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
                                  <label className="block text-white font-bold mb-2">{data.scaffolding.activity.question}</label>
                                  <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        value={scaffoldInput}
                                        onChange={(e) => setScaffoldInput(e.target.value)}
                                        placeholder="Your answer..."
                                        disabled={scaffoldFeedback === 'correct'}
                                        className={`flex-1 bg-slate-900 border-2 rounded-lg px-4 py-2 outline-none transition-all ${scaffoldFeedback === 'correct' ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 focus:border-indigo-500 text-white'}`}
                                      />
                                      <button 
                                        onClick={checkScaffold}
                                        disabled={!scaffoldInput.trim() || scaffoldFeedback === 'correct'}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-bold"
                                      >
                                          Check
                                      </button>
                                  </div>
                                  {scaffoldFeedback === 'correct' && (
                                      <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Correct! Well done.</p>
                                  )}
                                  {scaffoldFeedback === 'wrong' && (
                                      <p className="text-rose-400 text-sm mt-2">Not quite. Try again! (Hint: {data.scaffolding.activity.answer})</p>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* RECOMMENDATIONS */}
              {data.recommendations && data.recommendations.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      {data.recommendations.map((rec, idx) => (
                          <button
                            key={idx}
                            onClick={() => onSwitchActivity && onSwitchActivity(rec.id)}
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 p-4 rounded-xl text-left transition-all group flex items-start gap-4"
                          >
                              <div className="bg-slate-900 p-3 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                                  <Play className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">Try {rec.label}</h4>
                                  <p className="text-xs text-slate-400 mt-1">{rec.reason}</p>
                              </div>
                          </button>
                      ))}
                  </div>
              )}

              {/* SUGGESTIONS */}
              {data.suggestions && data.suggestions.length > 0 && (
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mt-8">
                  <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Explore Related Topics</h4>
                  <div className="flex flex-wrap gap-3">
                    {data.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExplain(null, s)}
                        className="px-4 py-2 bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        {s} <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ConceptExplainer;
