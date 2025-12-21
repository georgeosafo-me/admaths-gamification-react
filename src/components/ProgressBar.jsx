import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';

const ProgressBar = ({ progress }) => {
  let rank = "Novice";
  let Icon = Star;
  let color = "text-slate-400";

  if (progress >= 25) { rank = "Apprentice"; color = "text-indigo-400"; }
  if (progress >= 50) { rank = "Scholar"; color = "text-emerald-400"; }
  if (progress >= 75) { rank = "Expert"; color = "text-amber-400"; Icon = Trophy; }
  if (progress >= 100) { rank = "Master"; color = "text-rose-400"; Icon = Award; }

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-4 sticky top-[72px] z-40 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${color} flex items-center gap-1`}>
              <Icon className="w-3 h-3" /> {rank} Level
            </span>
            <span className="text-xs font-mono text-slate-400">{Math.round(progress)}% Explored</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
