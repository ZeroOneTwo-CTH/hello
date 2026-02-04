import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import HomePage from './pages/HomePage';
import MachinesPage from './pages/MachinesPage';
import TutorialsPage from './pages/TutorialsPage';
import TeamPage from './pages/TeamPage';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Refresh ScrollTrigger on route change
    ScrollTrigger.refresh();
  }, [location.pathname]);

  return (
    <div className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
