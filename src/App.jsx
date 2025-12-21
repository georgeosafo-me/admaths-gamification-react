import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import CoordinateGeometryQuest from './quests/geometry-trigonometry/coordinate-geometry';

function App() {
  const basename = import.meta.env.BASE_URL;

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/coordinate-geometry-quest" element={<CoordinateGeometryQuest />} />
      </Routes>
    </Router>
  );
}

export default App;
