import './App.css';
import 'bulma/css/bulma.css';
import 'react-tooltip/dist/react-tooltip.css'
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './components/welcomePage';
import About from './components/about';
import PlanVacation from './components/planVacation';
import VacationPlanResults from './components/vacationPlanResults';
import Navbar from './components/navBar';


export default function App() {
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const savedPlans = localStorage.getItem("plans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, [])
  return (
    <>
      <Router>
        <Navbar plans={plans} />
        <Routes>
          <Route path="/" exact element={<WelcomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/plan-vacation" element={<PlanVacation plans={ plans } setPlans={ setPlans } />} />
          <Route path="/vacation-plan-results" element={<VacationPlanResults plans={ plans } setPlans={ setPlans }/>} />
        </Routes>
      </Router>
    </>
  );
}
