import React from 'react';
import { Target, Map, Grid, RefreshCcw, HelpCircle } from 'lucide-react';

const QUEST_TYPES = [
  { id: 'crossword', label: 'Crossword Grid', icon: Grid, description: 'Solve math problems to unlock the number grid.' },
  { id: 'maze', label: 'Math Maze', icon: Map, description: 'Navigate the maze by answering questions correctly.' },
  { id: 'treasure', label: 'Treasure Hunt', icon: Target, description: 'Follow the clues to find the hidden treasure.' },
  // { id: 'unscramble', label: 'Unscramble', icon: RefreshCcw, description: 'Order the steps to solve the problem.' },
];

const QuestSelector = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      <h2 className="text-3xl font-bold text-white mb-2">Choose Your Quest</h2>
      <p className="text-slate-400 mb-8">Select a challenge type to begin your adventure.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {QUEST_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-left transition-all group flex flex-col h-full"
            >
              <div className="bg-slate-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300">{type.label}</h3>
              <p className="text-slate-400 text-sm">{type.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestSelector;
