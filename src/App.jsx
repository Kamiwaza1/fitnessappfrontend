import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NutritionDiary from './pages/NutritionDiary';
import WorkoutLogger from './pages/WorkoutLogger';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ProgressDashboard from './pages/ProgressDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/nutrition" element={<NutritionDiary />} />
        <Route path="/workouts" element={<WorkoutLogger />} />
        <Route path="/library" element={<ExerciseLibrary />} />
        <Route path="/progress" element={<ProgressDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Placeholder for settings */}
        <Route path="/settings" element={<div className="p-8 text-white">Settings Page (Not Implemented)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
