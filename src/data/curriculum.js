// src/data/curriculum.js

export const CURRICULUM = {
  algebra: {
    id: 'algebra',
    title: 'Algebra',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/50',
    subStrands: [
      { id: 'indices-logs', title: 'Indices & Logarithms' },
      { id: 'polynomials', title: 'Polynomials' },
      { id: 'partial-fractions', title: 'Partial Fractions' },
      { id: 'surds', title: 'Surds' },
      { id: 'sequences-series', title: 'Sequences & Series' },
      { id: 'binomial', title: 'Binomial Theorem' },
      { id: 'complex-numbers', title: 'Complex Numbers' },
      { id: 'matrices', title: 'Matrices' },
      { id: 'determinants', title: 'Determinants' },
      { id: 'vectors', title: 'Vectors (Algebraic)' },
      { id: 'linear-programming', title: 'Linear Programming' }
    ]
  },
  geometry: {
    id: 'geometry',
    title: 'Geometry & Trigonometry',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/50',
    subStrands: [
      { id: 'coordinate-geometry', title: 'Coordinate Geometry' },
      { id: 'trig-identities', title: 'Trigonometric Identities' },
      { id: 'radian-measure', title: 'Radian Measure' },
      { id: 'trig-equations', title: 'Trigonometric Equations' },
      { id: 'triangle-solutions', title: 'Solution of Triangles' },
      { id: 'loci', title: 'Loci' },
      { id: 'circles', title: 'Circles' },
      { id: 'mensuration', title: 'Mensuration' },
      { id: 'vectors-3d', title: 'Vectors in 3D' }
    ]
  },
  calculus: {
    id: 'calculus',
    title: 'Calculus',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    subStrands: [
      { id: 'functions', title: 'Functions' },
      { id: 'limits', title: 'Limits' },
      { id: 'differentiation', title: 'Differentiation' },
      { id: 'diff-applications', title: 'Applications of Differentiation' },
      { id: 'integration', title: 'Integration' },
      { id: 'int-applications', title: 'Applications of Integration' }
    ]
  },
  statistics: {
    id: 'statistics',
    title: 'Statistics & Probability',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/50',
    subStrands: [
      { id: 'permutation-combination', title: 'Permutation & Combination' },
      { id: 'probability', title: 'Probability' },
      { id: 'random-variables', title: 'Random Variables' },
      { id: 'distributions', title: 'Probability Distributions' },
      { id: 'measures', title: 'Measures of Central Tendency' }
    ]
  }
};

export const ACTIVITY_TYPES = [
  { id: 'quest', title: 'Quest', icon: 'Target', description: 'Multi-level crossword challenges' },
  { id: 'puzzle', title: 'Puzzle', icon: 'Puzzle', description: 'Brain teasers and logic puzzles' },
  { id: 'spin-wheel', title: 'Spin Wheel', icon: 'Loader2', description: 'Random questions and rewards' },
  { id: 'riddle', title: 'Riddle', icon: 'HelpCircle', description: 'Math riddles to solve' },
  { id: 'rearrange', title: 'Rearrange', icon: 'List', description: 'Order the steps correctly' },
  { id: 'error-correction', title: 'Error Correction', icon: 'XOctagon', description: 'Find the mistake' },
  { id: 'hotspot', title: 'Hotspot', icon: 'MousePointer2', description: 'Visual interactive diagrams' }
];
