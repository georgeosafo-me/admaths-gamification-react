// src/quests/geometry-trigonometry/coordinate-geometry/data/questions.js

export const TEMPLATES = [
    {
      id: 'classic',
      name: 'Solve the Linear Coordinate Geometry problems to unlock the grid',
      layout: [
        [0, 0, 1, 1, 0], // ..(1)(2).
        [0, 1, 1, 1, 1], // .(3). . .
        [0, 0, 1, 0, 0], // .. . ..
        [1, 1, 1, 1, 0], // (4). . .
        [0, 0, 1, 0, 0]  // .. . ..
      ],
      cellNumbers: { '0-2': 1, '0-3': 2, '1-1': 3, '3-0': 4 },
      aiInstructions: `
        GRID REQUIREMENTS (Integer answers MUST fit these lengths):
        - Intersection at "0-2": 1st digit of Across 1, 1st digit of Down 1.
        - Intersection at "0-3": 2nd digit of Across 1, 1st digit of Down 2.
        - Intersection at "1-2": 2nd digit of Across 3, 2nd digit of Down 1.
        - Intersection at "1-3": 3rd digit of Across 3, 2nd digit of Down 2.
        - Intersection at "3-2": 3rd digit of Across 4, 4th digit of Down 1.
        
        Slots:
        1. Across 1 (Starts at 0-2): 2 digits.
        2. Across 3 (Starts at 1-1): 4 digits.
        3. Across 4 (Starts at 3-0): 4 digits.
        4. Down 1 (Starts at 0-2): 5 digits.
        5. Down 2 (Starts at 0-3): 2 digits.
      `
    },
    {
      id: 'cross',
      name: 'Solve the Linear Coordinate Geometry problems to unlock the grid',
      layout: [
        [1, 1, 1, 0, 0], // (1) . . . .
        [0, 1, 0, 0, 0], // . . . . .
        [1, 1, 1, 1, 1], // (2) . . (3) .
        [0, 1, 0, 1, 0], // . . . . .
        [0, 1, 0, 1, 0]  // . . . . .
      ],
      cellNumbers: { '0-0': 1, '2-0': 2, '0-1': 3, '2-3': 4 },
      aiInstructions: `
        GRID REQUIREMENTS (Integer answers MUST fit these lengths):
        - Intersection at "0-1": 2nd digit of Across 1, 1st digit of Down 3.
        - Intersection at "2-1": 2nd digit of Across 2, 3rd digit of Down 3.
        - Intersection at "2-3": 4th digit of Across 2, 1st digit of Down 4.
        
        Slots:
        1. Across 1 (Starts at 0-0): 3 digits.
        2. Across 2 (Starts at 2-0): 5 digits.
        3. Down 3 (Starts at 0-1): 5 digits.
        4. Down 4 (Starts at 2-3): 3 digits.
      `
    }
  ];

  export const INITIAL_DATA = {
    easy: {
      solution: { '0-2': '5', '0-3': '5', '1-1': '1', '1-2': '2', '1-3': '0', '1-4': '5', '2-2': '5', '3-0': '1', '3-1': '0', '3-2': '0', '3-3': '0', '4-2': '0' },
      clues: {
        across: [
          { number: 1, question: "Distance (Direct)", text: "Length of segment from $A(0,0)$ to $B(25,0)$.", hint: "Horizontal distance" },
          { number: 3, question: "Substitution", text: "Value of y if $y=10x+5$ and $x=120$.", hint: "Plug in x" },
          { number: 4, question: "Slope", text: "Slope of $y=1000x+1$.", hint: "m value" }
        ],
        down: [
          { number: 1, question: "Squared Distance", text: "Distance squared from origin to $(150,0)$.", hint: "x²" },
          { number: 2, question: "Intercept", text: "y-intercept of $y=2x+50$.", hint: "b value" }
        ]
      }
    }
  };
