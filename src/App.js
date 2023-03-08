import './App.css';
import 'react-tooltip/dist/react-tooltip.css'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './components/welcomePage';
import About from './components/about';
import PlanVacation from './components/planVacation';
import VacationPlanResults from './components/vacationPlanResults';
import ExamplePlan from './components/examplePlan';


export default function App() {
  const [plans, setPlans] = useState([]);
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<WelcomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/examplePlan" element={<ExamplePlan />} />
        <Route path="/planVacation" element={<PlanVacation plans={ plans } setPlans={ setPlans } />} />
        <Route path="/vacationPlanResults" element={<VacationPlanResults plans={ plans } setPlans={ setPlans }/>} />
      </Routes>
    </Router>
  );
}
