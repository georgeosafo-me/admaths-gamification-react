import React, { useState, useEffect } from 'react';
import { Map, Loader2, Trophy, Navigation, Flag } from 'lucide-react';
import { callGemini } from '../../utils/aiLogic';
import AIHelpModal from '../AIHelpModal';

// Placeholder for Treasure Hunt Quest
const TreasureHuntQuest = ({ topic, onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [clue, setClue] = useState(null);
    const [step, setStep] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');

    // AI Help State
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [aiTitle, setAiTitle] = useState('');
    const [aiLoading, setAiLoading] = useState(false); // Kept if needed for future expansion or shared modal logic

    useEffect(() => {
        let mounted = true;
        const generateClue = async () => {
            setLoading(true);
            const prompt = `
                Create a "Treasure Hunt" clue for the topic: "${topic}".
                Step ${step + 1} of 3.
                The answer should be a number or a simple term.
                Return JSON:
                {
                    "location_description": "You are at the old library...",
                    "riddle": "Solve this to find the coordinate of the next key...",
                    "question": "Calculate...",
                    "answer": "..."
                }
            `;
            const result = await callGemini(prompt, true);
            if (mounted && result) {
                setClue(JSON.parse(result));
                setLoading(false);
            }
        };

        if (!gameOver) {
            generateClue();
        }
        
        return () => { mounted = false; };
    }, [step, topic, gameOver]);

    const handleSubmit = () => {
        if (userAnswer.trim().toLowerCase() === clue.answer.toString().toLowerCase()) {
            setStep(step + 1);
            setUserAnswer('');
            if (step + 1 >= 3) {
                setGameOver(true);
                if (onComplete) onComplete();
            }
        } else {
             setAiTitle("Wrong Coordinates");
             setAiResponse("That doesn't seem to point to the right location. Check your calculation!");
             setAiModalOpen(true);
        }
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Trophy className="w-24 h-24 text-yellow-400 mb-6 animate-bounce" />
                <h2 className="text-3xl font-bold text-white mb-4">Treasure Found!</h2>
                <p className="text-slate-400 mb-8">You have uncovered the secrets of {topic}.</p>
                <button 
                    onClick={() => { setStep(0); setGameOver(false); }}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                    Start New Hunt
                </button>
            </div>
        );
    }

    if (loading || !clue) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-400">Deciphering ancient maps...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <AIHelpModal 
                isOpen={aiModalOpen}
                onClose={() => setAiModalOpen(false)}
                title={aiTitle}
                content={aiResponse}
                loading={aiLoading}
            />

            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Map className="w-64 h-64 text-emerald-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                            <Navigation className="w-6 h-6" /> Hunt Stage {step + 1}/3
                        </h2>
                        <span className="bg-slate-900 px-4 py-1 rounded-full text-slate-400 text-sm">
                            {topic}
                        </span>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 mb-8">
                        <p className="text-slate-400 italic mb-4 flex items-start gap-2">
                            <Flag className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                            {clue.location_description}
                        </p>
                        <h3 className="text-xl font-bold text-white mb-2">{clue.riddle}</h3>
                        <p className="text-emerald-400 font-mono text-sm">{clue.question}</p>
                    </div>

                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Enter the code..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                        <button 
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all"
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreasureHuntQuest;
