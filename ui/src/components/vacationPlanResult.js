import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pdf } from './pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';


export default function VacationPlanResult ({ plan }) {
  const navigate = useNavigate();

  const pdfDownloadName = `${plan.location} Plan.pdf`;

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
        readOnly={true}
      />
      <div className="">
        {plan.text && plan.location &&
          <button className="button is-primary is-light has-text-black is-outlined mt-3 ml-2 mr-2">
            <PDFDownloadLink document={<Pdf planText={plan.text} vacationLocation={plan.location}/>} fileName={pdfDownloadName}>
              Download as PDF
            </PDFDownloadLink>
          </button>}
          <button className="button is-primary is-light has-text-black is-outlined mt-3 ml-2" onClick={startOver}>Create Another Plan</button>
      </div>
    </div>
  )
}
