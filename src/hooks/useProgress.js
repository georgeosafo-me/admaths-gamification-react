import { useState, useEffect } from 'react';

const useProgress = (topicId) => {
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    quest: 0,
    spin: 0,
    riddle: 0,
    rearrange: 0,
    error: 0,
    hotspot: 0,
    tutor: 0,
    exam: 0
  });

  // Load progress from localStorage on mount or topic change
  useEffect(() => {
    if (!topicId) return;
    const stored = localStorage.getItem(`admaths_progress_${topicId}`);
    if (stored) {
      setStats(JSON.parse(stored));
    } else {
      setStats({
        quest: 0, spin: 0, riddle: 0, rearrange: 0, 
        error: 0, hotspot: 0, tutor: 0, exam: 0
      });
    }
  }, [topicId]);

  // Calculate percentage whenever stats change
  useEffect(() => {
    // WEIGHTING LOGIC:
    // Core (High Impact): Quest, Exam -> 20% cap each (e.g., 2 successful completions)
    // Deep Learning (Med Impact): Rearrange, Error Correction, Hotspot -> 15% cap each
    // Engagement (Low Impact): Spin, Riddle, Tutor -> 5% cap each
    
    // Total potential sums to >100% to allow flexible mastery paths, but clamped at 100%.
    
    const calcScore = (count, weightPerItem, cap) => Math.min(count * weightPerItem, cap);

    const questScore = calcScore(stats.quest, 10, 20); // 2 quests
    const examScore = calcScore(stats.exam, 20, 20);   // 1 exam
    
    const rearrangeScore = calcScore(stats.rearrange, 7.5, 15); // 2 puzzles
    const errorScore = calcScore(stats.error, 7.5, 15);         // 2 corrections
    const hotspotScore = calcScore(stats.hotspot, 7.5, 15);     // 2 visuals
    
    const spinScore = calcScore(stats.spin, 1, 5);      // 5 spins
    const riddleScore = calcScore(stats.riddle, 2.5, 5); // 2 riddles
    const tutorScore = calcScore(stats.tutor, 1, 5);    // 5 queries

    const total = questScore + examScore + rearrangeScore + errorScore + hotspotScore + spinScore + riddleScore + tutorScore;
    
    setProgress(Math.min(total, 100));
  }, [stats]);

  const updateProgress = (type) => {
    if (!topicId) return;

    setStats((prev) => {
      const newStats = { ...prev, [type]: (prev[type] || 0) + 1 };
      localStorage.setItem(`admaths_progress_${topicId}`, JSON.stringify(newStats));
      return newStats;
    });
  };

  return { progress, updateProgress };
};

export default useProgress;
