# AdMath Gamification React

A scalable gamified learning platform for SHS Additional Mathematics, structured according to the **GES New Curriculum**. This project uses React (Vite) and Tailwind CSS to create interactive "Quests" for each sub-strand of the curriculum.

## 🚀 Project Goal

To build a modular, extensible platform where each mathematical topic is a "Quest". The system is designed to integrate with AI for dynamic question generation, explanations, and interactive challenges.

## 🌟 Key Features

*   **Interactive Quests**: Crossword puzzles and grid challenges.
*   **AI Tutor**: Context-aware explanations with SVG diagrams and subtopic suggestions.
*   **Spin Wheel**: Gamified reward system with difficulty-scaled questions.
*   **Exam Mode**: Timed quizzes with immediate feedback.
*   **Reward System**: Unlock calculator tips, quotes, and strategies.
*   **MathJax Support**: Beautiful rendering of mathematical equations.

## 📂 Folder Structure

The project follows a strict strand-based hierarchy in `src/quests/`:

```
src/quests/
├── algebra/
├── geometry-trigonometry/
│   └── coordinate-geometry/  <-- Reference Implementation
├── calculus/
└── statistics-probability/
```

### Adding a New Quest

1.  Create a folder for the sub-strand in `src/quests/<strand>/<sub-strand>/`.
2.  Follow the internal structure:
    *   `components/`: Quest-specific UI.
    *   `data/`: Question templates/data.
    *   `pages/`: The main page component for the quest.
    *   `utils/`: Helper logic.
    *   `index.js`: Export the main component.
3.  Register the route in `src/App.jsx`.

## 🛠 Tech Stack

*   **React 19** (Vite)
*   **Tailwind CSS 3**
*   **MathJax** (for rendering equations)
*   **Lucide React** (Icons)
*   **Google Gemini AI** (Content Generation)

## 🤖 AI Integration

The project uses Google Gemini for:
*   Generating crossword puzzles/questions.
*   Providing smart hints and conceptual explanations.
*   Text-to-Speech for clues.
*   Generating SVGs for geometric concepts.

## 📦 Installation & Usage

1.  Clone the repo:
    ```bash
    git clone https://github.com/georgeosafo-me/admaths-gamification-react.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run development server:
    ```bash
    npm run dev
    ```

## 🚀 Deployment

This project is configured for **GitHub Pages**.
Pushing to the `master` or `main` branch will trigger a GitHub Action to build and deploy the site to:
`https://georgeosafo-me.github.io/admaths-gamification-react/`
