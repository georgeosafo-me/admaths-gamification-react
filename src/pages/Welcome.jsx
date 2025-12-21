import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Puzzle, Loader2, HelpCircle, List, XOctagon, MousePointer2, ChevronRight, BookOpen, RefreshCcw } from 'lucide-react';
import { CURRICULUM, ACTIVITY_TYPES } from '../data/curriculum';

const iconMap = {
  Target, Puzzle, Loader2, HelpCircle, List, XOctagon, MousePointer2, BookOpen, RefreshCcw
};

const Welcome = () => {
  const navigate = useNavigate();
  const [selectedStrand, setSelectedStrand] = useState(null);
  const [selectedSubStrand, setSelectedSubStrand] = useState(null);

  const handleStrandSelect = (key) => {
    setSelectedStrand(CURRICULUM[key]);
    setSelectedSubStrand(null);
  };

  const handleSubStrandSelect = (sub) => {
    setSelectedSubStrand(sub);
  };

  const handleActivitySelect = (activityId) => {
    if (selectedStrand && selectedSubStrand) {
      // Navigate to the dynamic wrapper
      // Path: /quest/:strandId/:subStrandId?mode=:activityId
      navigate(`/quest/${selectedStrand.id}/${selectedSubStrand.id}?mode=${activityId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* HERO SECTION */}
      <header className="relative overflow-hidden bg-slate-800 border-b border-slate-700">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-emerald-500 to-blue-500"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              AdMaths <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Fun Learning</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
              Master SHS Additional Mathematics through AI-powered quests, puzzles, and interactive challenges designed for Ghanaian students.
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-md">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop" 
              alt="Students learning with fun" 
              className="rounded-2xl shadow-2xl border-4 border-slate-700 rotate-2 hover:rotate-0 transition-transform duration-500 w-full object-cover aspect-video"
            />
          </div>
        </div>
      </header>

      {/* MAIN SELECTION AREA */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* STEP 1: SELECT STRAND */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-300 mb-8 flex items-center gap-2">
            <span className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Select a Strand
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(CURRICULUM).map((key) => {
              const strand = CURRICULUM[key];
              const isSelected = selectedStrand?.id === strand.id;
              
              return (
                <button
                  key={strand.id}
                  onClick={() => handleStrandSelect(key)}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                    isSelected 
                      ? `${strand.borderColor} ${strand.bgColor} ring-2 ring-offset-2 ring-offset-slate-900 ring-emerald-500` 
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-2 ${strand.color}`}>{strand.title}</h3>
                  <p className="text-sm text-slate-400">{strand.subStrands.length} Topics Available</p>
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 2: SELECT TOPIC */}
        {selectedStrand && (
          <section className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
             <h2 className="text-2xl font-bold text-slate-300 mb-8 flex items-center gap-2">
              <span className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Select a Topic in <span className={selectedStrand.color}>{selectedStrand.title}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedStrand.subStrands.map((sub) => {
                const isSelected = selectedSubStrand?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubStrandSelect(sub)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-700 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{sub.title}</span>
                      {isSelected && <ChevronRight className="w-5 h-5 text-indigo-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 3: SELECT ACTIVITY */}
        {selectedSubStrand && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-2xl font-bold text-slate-300 mb-8 flex items-center gap-2">
              <span className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Choose Activity for <span className="text-indigo-400">{selectedSubStrand.title}</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ACTIVITY_TYPES.map((activity) => {
                const Icon = iconMap[activity.icon] || Target; // Fallback
                return (
                  <button
                    key={activity.id}
                    onClick={() => handleActivitySelect(activity.id)}
                    className="group p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700 hover:border-emerald-500/50 transition-all text-center flex flex-col items-center gap-4"
                  >
                    <div className="p-4 bg-slate-900 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                      <Icon className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 group-hover:text-white">{activity.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 mt-20 py-12 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-slate-300 font-medium mb-1">
               Designed by <span className="text-emerald-400 font-bold">George Osafo</span>
            </p>
            <p className="text-sm text-slate-400">
               CEO, <span className="text-blue-400">Stemfinite Education Network</span>
            </p>
          </div>
          
          <div className="h-px w-12 bg-slate-800 my-2"></div>

          <p className="text-xs text-slate-600">
            Powered by <span className="text-indigo-900/70 font-bold">Jules AI</span> & <span className="text-emerald-900/70 font-bold">Google Gemini</span>
          </p>
          
          <div className="flex justify-center gap-6 text-xs text-slate-700 mt-4">
            <span>© 2025 AdMaths Fun Learning</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
