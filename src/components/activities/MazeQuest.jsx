import React, { useState, useEffect } from 'react';
import { Target, Loader2, Trophy, ArrowRight, HelpCircle } from 'lucide-react';
import { callGemini } from '../../utils/aiLogic';
import AIHelpModal from '../AIHelpModal';

// Placeholder for Maze Quest
const MazeQuest = ({ topic, onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // AI Help State
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [aiTitle, setAiTitle] = useState('');
    const [aiLoading, setAiLoading] = useState(false);


    // Moved generateQuestion logic into a useCallback to be safely used in useEffect and handlers
    // or simply define it and use it if we manage deps correctly.
    // Simpler: define inside useEffect for initial load, and have a separate function for re-generation?
    // Actually, since we need to call it from handleOptionSelect, useCallback is best.
    
    // However, for simplicity and avoiding complex deps, I'll just put the logic in a function and suppress the warning 
    // OR properly memoize it. Let's try to keep it clean.

    useEffect(() => {
        let mounted = true;

        const generateQuestion = async () => {
            setLoading(true);
            const prompt = `
                Create a "Maze" style multiple choice question for the topic: "${topic}".
                The student is at a junction in a maze and needs to choose the correct path.
                Return JSON:
                {
                    "question": "...",
                    "options": [
                        {"id": "A", "text": "...", "isCorrect": false},
                        {"id": "B", "text": "...", "isCorrect": true},
                        {"id": "C", "text": "...", "isCorrect": false}
                    ],
                    "scenario": "You see three doors marked with equations..."
                }
            `;
            const result = await callGemini(prompt, true);
            if (mounted && result) {
                setCurrentQuestion(JSON.parse(result));
                setLoading(false);
            }
        };

        if (!gameOver) {
            generateQuestion();
        }

        return () => { mounted = false; };
    }, [topic, score, gameOver]); 

    const handleOptionSelect = (isCorrect) => {
        if (isCorrect) {
            setScore(prev => {
                const newScore = prev + 1;
                if (newScore >= 5) {
                    setGameOver(true);
                    if (onComplete) onComplete();
                }
                return newScore;
            });
        } else {
             setAiTitle("Dead End!");
             setAiResponse("That was the wrong path. Try again!");
             setAiModalOpen(true);
        }
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Trophy className="w-24 h-24 text-yellow-400 mb-6 animate-bounce" />
                <h2 className="text-3xl font-bold text-white mb-4">Maze Conquered!</h2>
                <p className="text-slate-400 mb-8">You successfully navigated the labyrinth of {topic}.</p>
                <button 
                    onClick={() => { setScore(0); setGameOver(false); generateQuestion(); }}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                    Play Again
                </button>
            </div>
        );
    }

    if (loading || !currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-400">Constructing the maze...</p>
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

            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                        <Target className="w-6 h-6" /> Maze Level {score + 1}/5
                    </h2>
                    <span className="bg-slate-900 px-4 py-1 rounded-full text-slate-400 text-sm">
                        Topic: {topic}
                    </span>
                </div>

                <div className="mb-8">
                    <p className="text-slate-400 italic mb-4">{currentQuestion.scenario}</p>
                    <h3 className="text-xl font-bold text-white mb-6">{currentQuestion.question}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentQuestion.options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleOptionSelect(opt.isCorrect)}
                                className="p-6 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-emerald-500 rounded-xl transition-all text-left flex flex-col gap-2 group"
                            >
                                <span className="font-bold text-emerald-400 group-hover:text-emerald-300">Option {opt.id}</span>
                                <span className="text-slate-200">{opt.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MazeQuest;
