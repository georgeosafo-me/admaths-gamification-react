// src/data/crosswordTemplates.js

export const TEMPLATES = [
    {
      id: 'classic',
      name: 'Unlock the Grid',
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
      name: 'Unlock the Grid',
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
