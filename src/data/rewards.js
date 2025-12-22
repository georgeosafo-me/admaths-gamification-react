export const REWARDS = [
  {
    type: 'calculator',
    title: 'CASIO fx-991EX Tip',
    content: 'Did you know? You can solve Quadratic Equations instantly! Go to Menu > Equation/Func > Polynomial > Degree 2.',
    icon: 'Calculator'
  },
  {
    type: 'quote',
    title: 'Power Value',
    content: '"Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding." – William Paul Thurston',
    icon: 'Quote'
  },
  {
    type: 'strategy',
    title: 'Exam Strategy',
    content: 'Always start with the questions you find easiest. This builds confidence and secures marks early!',
    icon: 'Brain'
  },
  {
    type: 'calculator',
    title: 'CASIO fx-991EX Tip',
    content: 'Use the CALC button to evaluate expressions for different values of x without retyping the formula.',
    icon: 'Calculator'
  },
  {
    type: 'quote',
    title: 'Life Quote',
    content: '"Success is the sum of small efforts, repeated day in and day out." – Robert Collier',
    icon: 'Quote'
  },
  {
    type: 'strategy',
    title: 'Walkthrough Tip',
    content: 'Show ALL your working. Even if the final answer is wrong, you get marks for the method!',
    icon: 'PenTool'
  }
];

export const getRandomReward = () => {
  return REWARDS[Math.floor(Math.random() * REWARDS.length)];
};
