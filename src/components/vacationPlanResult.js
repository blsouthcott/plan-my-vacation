import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pdf } from './pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';


export default function VacationPlanResult ({ plan, updatePlans }) {
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  const handlePlanTextChange = (e) => {
    const updatedPlan = {...plan};
    updatedPlan.text = e.target.value;
    updatePlans(updatedPlan);
  }

  const savePlan = () => {
    setIsEditable(false); 
    window.location.reload(true);
  }

  const startOver = () => {
    const plans = localStorage.getItem("plans");
    localStorage.clear();
    localStorage.setItem("plans", plans);
    navigate('/planVacation');
  }
  
  return (
    <div>
      <h1>Your Tailored Vacation Plan</h1>
      <textarea
        rows="10"
        cols="40"
        value={plan.text}
        onChange={e => handlePlanTextChange(e)}
        readOnly={!isEditable}
      />
      <br />
      {isEditable ?
        <button onClick={savePlan}>Save Plan</button>
      :
        <button onClick={() => setIsEditable(true)}>Edit Plan</button>
      }
      <br />
      <br />
      {plan.text && plan.location &&
      <PDFDownloadLink document={<Pdf planText={plan.text} vacationLocation={plan.location}/>} fileName="vacation_plan.pdf">
        Download as PDF
      </PDFDownloadLink>}
      <br />
      <br />
      Or
      <br />
      <br />
      <button onClick={startOver}>Create Another Plan</button>
    </div>
  )
}
