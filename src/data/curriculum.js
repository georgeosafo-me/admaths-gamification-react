// src/data/curriculum.js

// Based on GES New Curriculum for Additional Mathematics (SHS)
// Strands: Modelling with Algebra, Geometry & Trigonometry, Calculus, Statistics & Probability

export const CURRICULUM = {
  algebra: {
    id: 'algebra',
    title: 'Modelling with Algebra',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/50',
    subStrands: [
      { 
        id: 'binary-operations', 
        title: 'Binary Operations',
        topics: ['Properties (Commutative, Associative)', 'Identity and Inverse Elements', 'Operation Tables']
      },
      { 
        id: 'sets', 
        title: 'Sets & Operations',
        topics: ['Union, Intersection, Complement', 'Venn Diagrams (3 Sets)', 'Problem Solving with Sets'] 
      },
      { 
        id: 'indices-logarithms', 
        title: 'Indices & Logarithms',
        topics: ['Laws of Indices', 'Laws of Logarithms', 'Change of Base', 'Indicial Equations']
      },
      { 
        id: 'surds', 
        title: 'Surds',
        topics: ['Simplification of Surds', 'Rationalization of Denominators', 'Surd Equations']
      },
      { 
        id: 'polynomials', 
        title: 'Polynomials & Functions',
        topics: ['Remainder Theorem', 'Factor Theorem', 'Algebraic Division', 'Roots of Polynomials']
      },
      { 
        id: 'partial-fractions', 
        title: 'Partial Fractions',
        topics: ['Linear Denominators', 'Repeated Linear Factors', 'Quadratic Factors']
      },
      { 
        id: 'sequences-series', 
        title: 'Sequences & Series',
        topics: ['Arithmetic Progression (AP)', 'Geometric Progression (GP)', 'Sum to Infinity', 'Sigma Notation']
      },
      { 
        id: 'binomial-theorem', 
        title: 'Binomial Theorem',
        topics: ['Pascal\'s Triangle', 'Binomial Expansion formula', 'Finding Specific Terms', 'Approximations']
      },
      { 
        id: 'matrices', 
        title: 'Matrices & Transformations',
        topics: ['Matrix Operations', 'Determinant & Inverse (2x2, 3x3)', 'Linear Transformations', 'Solving Equations']
      },
      { 
        id: 'linear-inequalities', 
        title: 'Linear Inequalities & Programming',
        topics: ['Solving Linear Inequalities', 'Linear Programming', 'Objective Functions']
      },
      { 
        id: 'logic', 
        title: 'Logic & Proofs',
        topics: ['Statements & Truth Tables', 'Logical Connectives', 'Valid Arguments', 'Methods of Proof']
      }
    ]
  },
  geometry: {
    id: 'geometry',
    title: 'Geometry & Trigonometry',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/50',
    subStrands: [
      { 
        id: 'coordinate-geometry', 
        title: 'Coordinate Geometry (Lines)',
        topics: ['Distance Formula', 'Midpoint Formula', 'Gradient/Slope', 'Equation of a Line', 'Parallel & Perpendicular Lines', 'Intersection of Lines']
      },
      { 
        id: 'circles', 
        title: 'Coordinate Geometry (Circles)',
        topics: ['Equation of a Circle', 'Center and Radius', 'Tangent to a Circle', 'Intersection with Lines']
      },
      { 
        id: 'trig-ratios', 
        title: 'Trigonometric Ratios & Graphs',
        topics: ['Sine, Cosine, Tangent Ratios', 'Graphs of Trig Functions', 'Amplitude and Period', 'Solving Simple Trig Equations']
      },
      { 
        id: 'trig-identities', 
        title: 'Trigonometric Identities & Equations',
        topics: ['Pythagorean Identities', 'Compound Angles', 'Double Angles', 'Factor Formulae', 'Solving Complex Trig Equations']
      },
      { 
        id: 'vectors-2d', 
        title: 'Vectors in a Plane',
        topics: ['Vector Operations', 'Magnitude and Direction', 'Position Vectors', 'Scalar (Dot) Product', 'Geometric Applications']
      },
      { 
        id: 'vectors-3d', 
        title: 'Vectors in 3D',
        topics: ['3D Coordinates', 'Vectors in Space', 'Direction Cosines', 'Scalar Product in 3D']
      },
      { 
        id: 'kinematics', 
        title: 'Kinematics',
        topics: ['Displacement, Velocity, Acceleration', 'Calculus in Kinematics', 'Constant Acceleration Formulae (SUVAT)']
      }
    ]
  },
  calculus: {
    id: 'calculus',
    title: 'Calculus',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    subStrands: [
      { 
        id: 'limits-continuity', 
        title: 'Limits & Continuity',
        topics: ['Concept of Limits', 'Evaluating Limits', 'Continuity of Functions', 'First Principles']
      },
      { 
        id: 'differentiation', 
        title: 'Differentiation',
        topics: ['Power Rule', 'Chain Rule', 'Product Rule', 'Quotient Rule', 'Implicit Differentiation']
      },
      { 
        id: 'applications-diff', 
        title: 'Applications of Differentiation',
        topics: ['Tangents & Normals', 'Stationary Points', 'Optimization Problems', 'Rates of Change']
      },
      { 
        id: 'integration', 
        title: 'Integration',
        topics: ['Indefinite Integrals', 'Definite Integrals', 'Integration by Substitution', 'Integration by Parts']
      },
      { 
        id: 'applications-int', 
        title: 'Applications of Integration',
        topics: ['Area under Curve', 'Volume of Revolution', 'Kinematics (Integration)']
      },
      { 
        id: 'differential-equations', 
        title: 'Differential Equations',
        topics: ['First Order Differential Equations', 'Separation of Variables', 'General & Particular Solutions']
      }
    ]
  },
  statistics: {
    id: 'statistics',
    title: 'Statistics & Probability',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/50',
    subStrands: [
      { 
        id: 'data-representation', 
        title: 'Data Representation',
        topics: ['Histograms', 'Cumulative Frequency Curves', 'Box and Whisker Plots', 'Stem and Leaf Plots']
      },
      { 
        id: 'central-tendency', 
        title: 'Measures of Central Tendency & Dispersion',
        topics: ['Mean, Median, Mode', 'Variance', 'Standard Deviation', 'Grouped Data']
      },
      { 
        id: 'correlation-regression', 
        title: 'Correlation & Regression',
        topics: ['Scatter Diagrams', 'Line of Best Fit', 'Correlation Coefficient', 'Regression Lines']
      },
      { 
        id: 'probability', 
        title: 'Probability Theory',
        topics: ['Probability Laws', 'Conditional Probability', 'Independent Events', 'Tree Diagrams']
      },
      { 
        id: 'permutations-combinations', 
        title: 'Permutations & Combinations',
        topics: ['Factorial Notation', 'Arrangements (Permutations)', 'Selections (Combinations)', 'Applications']
      },
      { 
        id: 'probability-distributions', 
        title: 'Probability Distributions',
        topics: ['Binomial Distribution', 'Normal Distribution', 'Standard Normal Variable (Z)']
      }
    ]
  }
};

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
