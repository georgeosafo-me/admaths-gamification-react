import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import ActivityWrapper from './pages/ActivityWrapper';

function App() {
  const basename = import.meta.env.BASE_URL;

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        {/* Dynamic Route for all quests */}
        <Route path="/quest/:strandId/:subStrandId" element={<ActivityWrapper />} />
        
        {/* Legacy redirect for bookmark compatibility (optional) */}
        <Route path="/coordinate-geometry-quest" element={<ActivityWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
