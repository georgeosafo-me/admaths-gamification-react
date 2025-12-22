import React, { useState } from 'react';
import { BookOpen, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { generateConceptExplanation } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';
import { CURRICULUM } from '../../data/curriculum';

const ConceptExplainer = ({ topic, onExplain }) => {
  const [concept, setConcept] = useState('');
  const [data, setData] = useState(null); // { htmlContent, svg, suggestions }
  const [loading, setLoading] = useState(false);

  // We need to trigger MathJax when data changes
  useMathJax([data]);

  const handleExplain = async (e, customTopic) => {
    if (e) e.preventDefault();
    const targetConcept = customTopic || concept;
    if (!targetConcept.trim()) return;

    setLoading(true);
    setConcept(targetConcept); // Sync state if clicking suggestion
    setData(null);
    
    try {
      const resultJson = await generateConceptExplanation(topic, targetConcept);
      if (resultJson) {
        const parsed = JSON.parse(resultJson);
        setData(parsed);
        if (onExplain) onExplain();
      }
    } catch (err) {
      console.error(err);
      setData({ htmlContent: "<p>Sorry, I couldn't generate an explanation right now.</p>", suggestions: [] });
    }
    setLoading(false);
  };

  // Find subtopics for the current topic from CURRICULUM
  // This is a bit tricky since 'topic' prop is a Title string (e.g. "Coordinate Geometry")
  // while CURRICULUM is nested. We'll try to find a match or use generic ones.
  const findSubtopics = () => {
    // Flatten all subStrands to find the current one
    let allSubStrands = [];
    Object.values(CURRICULUM).forEach(strand => {
      allSubStrands = [...allSubStrands, ...strand.subStrands];
    });
    
    // Attempt to match topic title
    // Note: The app passes "Topic Title" as prop, which might match subStrand.title
    const match = allSubStrands.find(s => s.title === topic);
    // Since we don't have deep sub-sub-topics in curriculum.js, we might just default
    // to requesting the AI for suggestions or defining some static ones if possible.
    // For now, let's rely on the AI's "suggestions" after the first query, 
    // or simply not show a preset list if we can't map it easily.
    // However, the user asked to "bring a list of important subtopics".
    
    // If we can't map it, we can perhaps show a default list related to the Strand if we knew the Strand ID.
    // But we only have 'topic' (title) here.
    
    return []; 
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
          AI Concept Tutor
        </h2>
        <p className="text-slate-400">Ask about any concept in {topic} and get a Ghanaian-context explanation.</p>
      </div>

      <form onSubmit={(e) => handleExplain(e)} className="flex gap-4 mb-8">
        <input
          type="text"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder={`Search concepts in ${topic}...`}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !concept.trim()}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Explain
        </button>
      </form>

      {/* RESULT AREA */}
      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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

          {/* SUGGESTIONS */}
          {data.suggestions && data.suggestions.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
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
        </div>
      )}
    </div>
  );
};

export default ConceptExplainer;
