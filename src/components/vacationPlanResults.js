import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function VacationPlanResults ({ plan }) {

  const [planText, setPlanText] = useState(plan);
  const [isEditable, setIsEditable] = useState(false);
  const [savePlanOpt, setSavePlanOpt] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleDownload = () => {
    // logic to download the document
  }

  const handlePlanTextChange = (e) => {
    setPlanText(e.target.value);
    localStorage.setItem('plan', e.target.value);
  }

  const startOver = () => {
    localStorage.clear();
    navigate('/planVacation');
  }

  useEffect(() => {
    if (plan) {
      setPlanText(plan);
      localStorage.setItem('plan', plan)
    } else {
      const savedPlan = localStorage.getItem('plan');
      if (savedPlan) {
        setPlanText(savedPlan);
      };
    };
  }, [])

  return (
    <div>
      <h1>Your Tailored Vacation Plan</h1>
      <textarea
        rows="10"
        cols="40"
        value={planText}
        onChange={e => handlePlanTextChange(e)}
        readOnly={!isEditable}
      />
      <br />
      {isEditable ?
        <button onClick={() => setIsEditable(false)}>Save Plan</button>
      :
        <button onClick={() => setIsEditable(true)}>Edit Plan</button>
      }
      <br />
      <br />
      <label>
      <input
      type='radio'
      value='download-pdf'
      checked={savePlanOpt === 'download-pdf' ? true : false}
      onChange={() => setSavePlanOpt('download-pdf')}
      />
      Download as PDF
      </label>
      <br />
      <label>
      <input
      type='radio'
      value='send-to-email'
      checked={savePlanOpt === 'send-to-email' ? true : false}
      onChange={() => setSavePlanOpt('send-to-email')}
      />
      Send Plan to email
      </label>
      {savePlanOpt === 'send-to-email' &&
      <>
      <br />
      <input
      type='text'
      placeholder='Enter your email...'
      value={userEmail}
      onChange={e => setUserEmail(e.target.value)}
      />
      </>}
      <br />
      <button onClick={handleDownload}>Save Plan</button>
      &nbsp;
      &nbsp;
      <button onClick={startOver}>Start Over</button>
    </div>
  )
}
