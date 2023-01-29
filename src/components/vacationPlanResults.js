import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function VacationPlanResults ({ plan }) {

  const [planText, setPlanText] = useState(plan);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  const handleDownload = () => {
    // logic to download the document
  }

  const startOver = () => {
    navigate('/planVacation');
  }

  return (
    <div>
      <h1>Your Tailored Vacation Plan</h1>
      <textarea
        rows="10"
        cols="40"
        value={planText}
        onChange={e => setPlanText(e.target.value)}
        readOnly={!isEditable}
      />
      <br />
      {isEditable ?
        <button onClick={() => setIsEditable(false)}>Save</button>
      :
        <button onClick={() => setIsEditable(true)}>Edit</button>
      }
      <br />
      <br />
      <button onClick={handleDownload}>Download</button>
      <br />
      <button onClick={startOver}>Start Over</button>
    </div>
  )
}
