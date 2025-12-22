// src/data/curriculum.js

// Based on GES New Curriculum for Additional Mathematics (SHS)
// Strands: Modelling with Algebra, Geometry & Trigonometry, Calculus, Statistics & Probability
// (Note: Some sub-strands are inferred from standard Add Math curricula compatible with the new structure)

export const CURRICULUM = {
  algebra: {
    id: 'algebra',
    title: 'Modelling with Algebra',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/50',
    subStrands: [
      { id: 'binary-operations', title: 'Binary Operations' },
      { id: 'sets', title: 'Sets & Operations' },
      { id: 'indices-logarithms', title: 'Indices & Logarithms' },
      { id: 'surds', title: 'Surds' },
      { id: 'polynomials', title: 'Polynomials & Functions' },
      { id: 'partial-fractions', title: 'Partial Fractions' },
      { id: 'sequences-series', title: 'Sequences & Series' },
      { id: 'binomial-theorem', title: 'Binomial Theorem' },
      { id: 'matrices', title: 'Matrices & Transformations' },
      { id: 'linear-inequalities', title: 'Linear Inequalities & Programming' },
      { id: 'logic', title: 'Logic & Proofs' }
    ]
  },
  geometry: {
    id: 'geometry',
    title: 'Geometry & Trigonometry',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/50',
    subStrands: [
      { id: 'coordinate-geometry', title: 'Coordinate Geometry (Lines)' },
      { id: 'circles', title: 'Coordinate Geometry (Circles)' },
      { id: 'trig-ratios', title: 'Trigonometric Ratios & Graphs' },
      { id: 'trig-identities', title: 'Trigonometric Identities & Equations' },
      { id: 'vectors-2d', title: 'Vectors in a Plane' },
      { id: 'vectors-3d', title: 'Vectors in 3D' },
      { id: 'kinematics', title: 'Kinematics' }
    ]
  },
  calculus: {
    id: 'calculus',
    title: 'Calculus',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    subStrands: [
      { id: 'limits-continuity', title: 'Limits & Continuity' },
      { id: 'differentiation', title: 'Differentiation' },
      { id: 'applications-diff', title: 'Applications of Differentiation' },
      { id: 'integration', title: 'Integration' },
      { id: 'applications-int', title: 'Applications of Integration' },
      { id: 'differential-equations', title: 'Differential Equations' }
    ]
  },
  statistics: {
    id: 'statistics',
    title: 'Statistics & Probability',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/50',
    subStrands: [
      { id: 'data-representation', title: 'Data Representation' },
      { id: 'central-tendency', title: 'Measures of Central Tendency & Dispersion' },
      { id: 'correlation-regression', title: 'Correlation & Regression' },
      { id: 'probability', title: 'Probability Theory' },
      { id: 'permutations-combinations', title: 'Permutations & Combinations' },
      { id: 'probability-distributions', title: 'Probability Distributions (Binomial, Normal)' }
    ]
  }
};

// Updated list of 8 activities, with 'Tutor' first as requested
export const ACTIVITY_TYPES = [
  { id: 'concept-explainer', title: 'Tutor', icon: 'BookOpen', description: 'AI Tutor with Ghanaian Context' },
  { id: 'quest', title: 'Quest', icon: 'Target', description: 'Crossword & Grid Challenges' },
  { id: 'spin-wheel', title: 'Spin Wheel', icon: 'Loader2', description: 'GHS Prize Questions' },
  { id: 'riddle', title: 'Riddle', icon: 'HelpCircle', description: 'Math Riddles & Logic' },
  { id: 'rearrange', title: 'Rearrange', icon: 'RefreshCcw', description: 'Order the Steps' },
  { id: 'error-correction', title: 'Error Fix', icon: 'XOctagon', description: 'Find the Mistake' },
  { id: 'hotspot', title: 'Hotspot', icon: 'MousePointer2', description: 'Visual Identification' },
  { id: 'exam-mode', title: 'Exam Mode', icon: 'List', description: 'Timed Quizzes & Tests' }
];
