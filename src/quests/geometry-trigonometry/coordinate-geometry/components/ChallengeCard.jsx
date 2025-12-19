import React from 'react';
import { Volume2, StopCircle, Lightbulb, BookOpen } from 'lucide-react';

const ChallengeCard = ({ 
  clues, 
  playingClueId, 
  handleReadAloud, 
  handleSmartHint, 
  handleExplainConcept 
}) => {
  if (!clues.across || clues.across.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-slate-500">
            <p>Load a mission to see protocols.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* ACROSS CLUES */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Across (Horizontal)
        </h3>
        <div className="space-y-4">
          {clues.across.map((clue) => (
            <div key={`a-${clue.number}`} className="group p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700 transition-colors border border-transparent hover:border-blue-500/30">
              <div className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg font-bold font-mono">
                  {clue.number}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-blue-400/80 font-bold uppercase mb-1">{clue.question}</p>
                    <button
                      onClick={() => handleReadAloud(clue, `a-${clue.number}`)}
                      className={`p-1.5 rounded-full transition-colors ${playingClueId === `a-${clue.number}` ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {playingClueId === `a-${clue.number}` ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <p className="text-slate-200 text-sm leading-relaxed mb-3 math-content">{clue.text}</p>
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleSmartHint(clue)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs rounded-md border border-indigo-500/20"><Lightbulb className="w-3 h-3" /> Hint</button>
                    <button onClick={() => handleExplainConcept(clue)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs rounded-md border border-emerald-500/20"><BookOpen className="w-3 h-3" /> Concept</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOWN CLUES */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Down (Vertical)
        </h3>
        <div className="space-y-4">
          {clues.down.map((clue) => (
            <div key={`d-${clue.number}`} className="group p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700 transition-colors border border-transparent hover:border-purple-500/30">
              <div className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-purple-500/10 text-purple-400 rounded-lg font-bold font-mono">
                  {clue.number}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-purple-400/80 font-bold uppercase mb-1">{clue.question}</p>
                    <button
                      onClick={() => handleReadAloud(clue, `d-${clue.number}`)}
                      className={`p-1.5 rounded-full transition-colors ${playingClueId === `d-${clue.number}` ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {playingClueId === `d-${clue.number}` ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed mb-3 math-content">{clue.text}</p>
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleSmartHint(clue)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs rounded-md border border-indigo-500/20"><Lightbulb className="w-3 h-3" /> Hint</button>
                    <button onClick={() => handleExplainConcept(clue)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs rounded-md border border-emerald-500/20"><BookOpen className="w-3 h-3" /> Concept</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
