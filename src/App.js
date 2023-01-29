import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './components/welcomePage';
import About from './components/about';
import PlanVacation from './components/planVacation';
import VacationPlanResults from './components/vacationPlanResults';


export default function App() {
  const [plan, setPlan] = useState('');
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<WelcomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/planVacation" element={<PlanVacation setPlan={ setPlan }/>} />
        <Route path="/vacationPlanResults" element={<VacationPlanResults plan={ plan }/>} />
      </Routes>
    </Router>
  );
}
