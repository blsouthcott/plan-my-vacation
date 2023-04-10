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
    // reload the page so the PDF will re-render with the changes the user made
    // this is the only way I could get the changes to be reflected in the PDF
    window.location.reload();
  }

  // takes the user back to the vacation plan form so they can generate another plan
  const startOver = () => {
    const plans = localStorage.getItem("plans");
    localStorage.clear();
    localStorage.setItem("plans", plans);
    navigate('/planVacation');
  }
  
  return (
    <div>
      <h1 className="title">Your Tailored Vacation Plan</h1>
      <textarea
        className="textarea"
        rows="15"
        cols="75"
        value={plan.text}
        onChange={e => handlePlanTextChange(e)}
        readOnly={!isEditable}
      />
      <div className="">
        {isEditable ?
          <button className="button is-primary is-light has-text-black is-outlined mt-3 mr-2 ml-2" onClick={savePlan}>Save Plan</button>
        :
          <button className="button is-primary is-light has-text-black is-outlined mt-3 mr-2 ml-2" onClick={() => setIsEditable(true)}>Edit Plan</button>
        }
        {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
        {plan.text && plan.location &&
          <button className="button is-primary is-light has-text-black is-outlined mt-3 ml-2 mr-2">
            <PDFDownloadLink document={<Pdf planText={plan.text} vacationLocation={plan.location}/>} fileName="vacation_plan.pdf">
              Download as PDF
            </PDFDownloadLink>
          </button>}
          <button className="button is-primary is-light has-text-black is-outlined mt-3 ml-2" onClick={startOver}>Create Another Plan</button>
      </div>
    </div>
  )
}
