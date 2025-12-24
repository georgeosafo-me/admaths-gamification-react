import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { LayoutGrid, Loader2, ArrowLeft, BookOpen, List, Target, HelpCircle, RefreshCcw, Maximize, XOctagon } from 'lucide-react';

// Import specific activity components
import SpinWheel from '../components/activities/SpinWheel';
import ConceptExplainer from '../components/activities/ConceptExplainer';
import CrosswordQuest from '../components/activities/CrosswordQuest';
import MazeQuest from '../components/activities/MazeQuest';
import TreasureHuntQuest from '../components/activities/TreasureHuntQuest';
import QuestSelector from '../components/QuestSelector';
import ExamMode from '../components/activities/ExamMode';
import Riddle from '../components/activities/Riddle';
import Rearrange from '../components/activities/Rearrange';
import ErrorCorrection from '../components/activities/ErrorCorrection';
import Hotspot from '../components/activities/Hotspot';

import ProgressBar from '../components/ProgressBar';
import useProgress from '../hooks/useProgress';
import RewardModal from '../components/RewardModal';
import { getRandomReward } from '../data/rewards';

const ActivityWrapper = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subStrandId } = useParams(); 
  
  // Reward Logic
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(getRandomReward());

  const handleProgressUpdate = (type) => {
    updateProgress(type);
    // Show reward with 30% chance or logic based on type? 
    // User asked "when a person answers a question correctly". 
    // For now, we trigger it on every significant completion event to ensure visibility.
    setCurrentReward(getRandomReward());
    setShowReward(true);
  };

  // Progress Logic
  const { progress, updateProgress } = useProgress(subStrandId);

  // Default mode
  const initialMode = searchParams.get('mode') || 'quest';
  const [activeMode, setActiveMode] = useState(initialMode);

  // Quest Type from URL
  const questType = searchParams.get('type');
  const setQuestType = (type) => {
      setSearchParams({ mode: 'quest', type });
  };

  // Sync URL for mode (preserve type if mode is quest)
  useEffect(() => {
    if (activeMode === 'quest' && questType) {
        setSearchParams({ mode: activeMode, type: questType });
    } else {
        setSearchParams({ mode: activeMode });
    }
  }, [activeMode, setSearchParams]); // questType is in URL, so we don't sync it back here effectively, but we handle mode changes.

  const getTopicTitle = (id) => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const ACTIVITIES = [
    { id: 'concept-explainer', label: 'Tutor', icon: BookOpen },
    { id: 'quest', label: 'Quest', icon: Target },
    { id: 'spin-wheel', label: 'Spin Wheel', icon: Loader2 },
    { id: 'riddle', label: 'Riddle', icon: HelpCircle },
    { id: 'rearrange', label: 'Rearrange', icon: RefreshCcw },
    { id: 'error-correction', label: 'Error Fix', icon: XOctagon },
    { id: 'hotspot', label: 'Hotspot', icon: Maximize },
    { id: 'exam-mode', label: 'Exam', icon: List },
  ];

  const renderContent = () => {
    const topicTitle = getTopicTitle(subStrandId || 'Topic');

    // Generic fallbacks for other topics/activities
    switch (activeMode) {
      case 'quest':
        if (!questType) {
            return <QuestSelector onSelect={setQuestType} />;
        }
        if (questType === 'crossword') return <CrosswordQuest topic={topicTitle} onComplete={() => handleProgressUpdate('quest')} />;
        if (questType === 'maze') return <MazeQuest topic={topicTitle} onComplete={() => handleProgressUpdate('quest')} />;
        if (questType === 'treasure') return <TreasureHuntQuest topic={topicTitle} onComplete={() => handleProgressUpdate('quest')} />;
        return <QuestSelector onSelect={setQuestType} />;
      case 'spin-wheel':
        return <SpinWheel topic={topicTitle} onCorrect={() => handleProgressUpdate('spin')} />;
      case 'concept-explainer':
        // Tutor doesn't necessarily need a reward pop-up for just asking, 
        // but user said "when a person answers...". 
        // Tutor is exploration. Maybe no reward there? 
        // Or maybe just progress update. Let's keep reward for "correct" answers/completion.
        return <ConceptExplainer topic={topicTitle} topicId={subStrandId} onExplain={() => updateProgress('tutor')} />;
      case 'exam-mode':
        return <ExamMode topic={topicTitle} onComplete={() => handleProgressUpdate('exam')} />;
      case 'riddle':
        return <Riddle topic={topicTitle} onCorrect={() => handleProgressUpdate('riddle')} />;
      case 'rearrange':
        return <Rearrange topic={topicTitle} onCorrect={() => handleProgressUpdate('rearrange')} />;
      case 'error-correction':
        return <ErrorCorrection topic={topicTitle} onCorrect={() => handleProgressUpdate('error')} />;
      case 'hotspot':
        return <Hotspot topic={topicTitle} onCorrect={() => handleProgressUpdate('hotspot')} />;
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
      
      <RewardModal 
        isOpen={showReward} 
        onClose={() => setShowReward(false)} 
        reward={currentReward} 
      />
    </div>
  );
};

export default ActivityWrapper;
