import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CoordinateGeometryQuest from './quests/geometry-trigonometry/coordinate-geometry';

function App() {
  // Determine the basename based on the environment
  // In production (GitHub Pages), it will be '/admaths-gamification-react/'
  // In development, it's typically '/' unless configured otherwise.
  // Vite injects import.meta.env.BASE_URL which comes from vite.config.js 'base'.
  const basename = import.meta.env.BASE_URL;

  return (
    <Router basename={basename}>
      <div className="bg-slate-900 min-h-screen text-slate-100">
        <Routes>
          <Route path="/" element={
            <div className="p-8 text-center">
              <h1 className="text-4xl font-bold text-emerald-400 mb-8">AdMath Gamification React</h1>
              <p className="mb-8 text-slate-400">Select a Quest to begin:</p>
              <Link to="/coordinate-geometry-quest" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-all">
                Start Coordinate Geometry Quest
              </Link>
            </div>
          } />
          <Route path="/coordinate-geometry-quest" element={<CoordinateGeometryQuest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
