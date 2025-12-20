import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LayoutGrid, Loader2, ArrowLeft } from 'lucide-react';
import CoordinateGeometryQuest from './CoordinateGeometryQuest'; // The existing crossword game
import SpinWheel from '../../../../components/activities/SpinWheel';

const CoordinateGeometryWrapper = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Initialize state from URL param 'mode', default to 'quest'
  const initialMode = searchParams.get('mode') === 'spin-wheel' ? 'spin-wheel' : 'quest';
  const [activeMode, setActiveMode] = useState(initialMode);

  // Sync state changes back to URL (optional but good for history)
  useEffect(() => {
    setSearchParams({ mode: activeMode });
  }, [activeMode, setSearchParams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 p-4 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                title="Back to Welcome Page"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-emerald-400 hidden md:block">Coordinate Geometry</h1>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-lg">
            <button 
                onClick={() => setActiveMode('quest')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeMode === 'quest' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                Crossword Quest
            </button>
            <button 
                onClick={() => setActiveMode('spin-wheel')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeMode === 'spin-wheel' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                Spin Wheel
            </button>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-1">
        {activeMode === 'quest' && <CoordinateGeometryQuest />}
        
        {activeMode === 'spin-wheel' && (
            <div className="max-w-4xl mx-auto p-8 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                    Daily Rewards & Trivia
                </h2>
                <p className="text-slate-400 mb-8">Spin to win facts, tips, and mini-challenges about Coordinate Geometry.</p>
                
                <SpinWheel topic="Coordinate Geometry" />
            </div>
        )}
      </div>
    </div>
  );
};

export default CoordinateGeometryWrapper;
