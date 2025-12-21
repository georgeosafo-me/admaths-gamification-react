import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { LayoutGrid, Loader2, ArrowLeft, BookOpen, List, Target, HelpCircle, RefreshCcw, Maximize, XOctagon } from 'lucide-react';

// Import specific activity components
import CoordinateGeometryQuest from '../quests/geometry-trigonometry/coordinate-geometry/pages/CoordinateGeometryQuest'; 
import SpinWheel from '../components/activities/SpinWheel';
import ConceptExplainer from '../components/activities/ConceptExplainer';
import ExamMode from '../components/activities/ExamMode';
import Riddle from '../components/activities/Riddle';
import Rearrange from '../components/activities/Rearrange';
import ErrorCorrection from '../components/activities/ErrorCorrection';
import Hotspot from '../components/activities/Hotspot';

import ProgressBar from '../components/ProgressBar';
import useProgress from '../hooks/useProgress';

const ActivityWrapper = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subStrandId } = useParams(); 
  
  // Progress Logic
  const { progress, updateProgress } = useProgress(subStrandId);

  // Default mode
  const initialMode = searchParams.get('mode') || 'quest';
  const [activeMode, setActiveMode] = useState(initialMode);

  // Sync URL
  useEffect(() => {
    setSearchParams({ mode: activeMode });
  }, [activeMode, setSearchParams]);

  const getTopicTitle = (id) => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const ACTIVITIES = [
    { id: 'quest', label: 'Quest', icon: Target },
    { id: 'spin-wheel', label: 'Spin Wheel', icon: Loader2 },
    { id: 'riddle', label: 'Riddle', icon: HelpCircle },
    { id: 'rearrange', label: 'Rearrange', icon: RefreshCcw },
    { id: 'error-correction', label: 'Error Fix', icon: XOctagon },
    { id: 'hotspot', label: 'Hotspot', icon: Maximize },
    { id: 'concept-explainer', label: 'Tutor', icon: BookOpen },
    { id: 'exam-mode', label: 'Exam', icon: List },
  ];

  const renderContent = () => {
    const topicTitle = getTopicTitle(subStrandId || 'Topic');

    // Special case for our fully implemented Coordinate Geometry module quest
    if (subStrandId === 'coordinate-geometry' && activeMode === 'quest') {
        return <CoordinateGeometryQuest onComplete={() => updateProgress('quest')} />;
    }

    // Generic fallbacks for other topics/activities
    switch (activeMode) {
      case 'quest':
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Target className="w-16 h-16 text-slate-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-300">Quest Mode</h2>
                <p className="text-slate-500">Coordinate Geometry is the only fully implemented Quest right now.</p>
            </div>
        );
      case 'spin-wheel':
        return <SpinWheel topic={topicTitle} onCorrect={() => updateProgress('spin')} />;
      case 'concept-explainer':
        return <ConceptExplainer topic={topicTitle} onExplain={() => updateProgress('tutor')} />;
      case 'exam-mode':
        return <ExamMode topic={topicTitle} onComplete={() => updateProgress('exam')} />;
      case 'riddle':
        return <Riddle topic={topicTitle} onCorrect={() => updateProgress('riddle')} />;
      case 'rearrange':
        return <Rearrange topic={topicTitle} onCorrect={() => updateProgress('rearrange')} />;
      case 'error-correction':
        return <ErrorCorrection topic={topicTitle} onCorrect={() => updateProgress('error')} />;
      case 'hotspot':
        return <Hotspot topic={topicTitle} onCorrect={() => updateProgress('hotspot')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 p-4 px-4 md:px-8 flex flex-col xl:flex-row items-center justify-between sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-4 w-full xl:w-auto">
            <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                title="Back to Welcome Page"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-emerald-400 truncate max-w-[200px] md:max-w-none">
                {getTopicTitle(subStrandId || 'Topic')}
            </h1>
        </div>

        {/* Scrollable Horizontal Tabs */}
        <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
            <div className="flex bg-slate-800/50 p-1 rounded-xl gap-1 min-w-max">
                {ACTIVITIES.map((act) => {
                    const Icon = act.icon;
                    const isActive = activeMode === act.id;
                    return (
                        <button 
                            key={act.id}
                            onClick={() => setActiveMode(act.id)}
                            className={`
                                px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                ${isActive 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            {act.label}
                        </button>
                    );
                })}
            </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Content Area */}
      <div className="flex-1 overflow-x-hidden animate-in fade-in duration-300">
        {renderContent()}
      </div>
    </div>
  );
};

export default ActivityWrapper;
