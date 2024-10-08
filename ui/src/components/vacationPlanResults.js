import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pdf } from "./pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import "react-tabs/style/react-tabs.css";
import Footer from "./footer";

const startOver = (navigate) => {
  const plans = localStorage.getItem("plans");
  localStorage.clear();
  localStorage.setItem("plans", plans);
  navigate("/plan-vacation");
}

const changePlan = (e, plans, setSelectedPlan) => {
  for (let plan of plans) {
    if (plan.key == e.target.value) {
      setSelectedPlan({...plan});
      break;
    };
  };
}

const loadSavedPlans = (plans, setPlans, setSelectedPlan) => {
  if (plans.length === 0) {
    console.log("no plans")
    const savedPlans = localStorage.getItem("plans");
    if (savedPlans) {
      console.log("setting vacation plans from local storage");
      const parsedPlans = JSON.parse(savedPlans);
      setPlans(parsedPlans);
      setSelectedPlan(parsedPlans[0]);
    };
  } else {
    setSelectedPlan({...plans.at(-1)});
  };
}


export default function VacationPlanResults ({ plans, setPlans }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const handleStartOver = () => startOver(navigate);
  const handlePlanChange = (e) => changePlan(e, plans, setSelectedPlan);
  const pdfDownloadName = `${selectedPlan?.location} Plan.pdf`;

  useEffect(() => {
    loadSavedPlans(plans, setPlans, setSelectedPlan);
  }, [])

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container my-3">
          {plans?.length > 0 ? 
          <>
            <h1 className="title mb-3">Your Tailored Vacations Plans</h1>
            <div className="select">
              <select onChange={handlePlanChange} value={selectedPlan?.key}>
                {plans.map((plan, i) => (
                  <option key={plan.key} value={plan.key}>{i+1} - {plan.location}</option>
                ))}
              </select>
            </div>
            <hr className="my-3"/>
            <textarea
              className="textarea"
              rows="15"
              cols="75"
              value={selectedPlan?.text}
              readOnly={true}
            />
            {selectedPlan?.text && selectedPlan?.location &&
            <>
              <button className="button is-primary is-light has-text-black is-outlined mt-4 mx-2">
                <PDFDownloadLink document={<Pdf planText={selectedPlan?.text} vacationLocation={selectedPlan?.location}/>} fileName={pdfDownloadName}>
                  Download as PDF
                </PDFDownloadLink>
              </button>
            </>}
            <button className="button is-primary is-light has-text-black is-outlined mt-4 ml-2" onClick={handleStartOver}>Plan Another Vacation!</button>
          </>
          : <p>No plans to display!</p>}
        </div>
      </div>
      <Footer />
    </section>
  )
}