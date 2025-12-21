import React, { useState } from 'react';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { generateConceptExplanation } from '../../utils/aiLogic';
import useMathJax from '../../hooks/useMathJax';

const ConceptExplainer = ({ topic }) => {
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  useMathJax([explanation]);

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!concept.trim()) return;

    setLoading(true);
    setExplanation(null);
    const result = await generateConceptExplanation(topic, concept);
    setExplanation(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
          AI Concept Tutor
        </h2>
        <p className="text-slate-400">Ask about any concept in {topic} and get a Ghanaian-context explanation.</p>
      </div>

      <form onSubmit={handleExplain} className="flex gap-4 mb-8">
        <input
          type="text"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="e.g., Gradient of a line, Dot Product, Binomial Expansion..."
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

      {explanation && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Explanation: {concept}</h3>
          </div>
          
          {/* Enhanced Typography for Dark Mode */}
          <div 
            className="prose prose-lg prose-invert max-w-none 
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-headings:text-emerald-300 
              prose-strong:text-indigo-400 prose-strong:font-bold
              prose-ul:text-slate-300 prose-li:marker:text-emerald-500
              prose-code:text-amber-300 prose-code:bg-slate-900/50 prose-code:px-1 prose-code:rounded
            "
            dangerouslySetInnerHTML={{ __html: explanation }}
          />
        </div>
      )}
    </div>
  );
};

export default ConceptExplainer;
