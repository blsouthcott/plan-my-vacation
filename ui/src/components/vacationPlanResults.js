import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Pdf } from './pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import 'react-tabs/style/react-tabs.css';
import Footer from "./footer";


function VacationPlanResult ({ plan }) {
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
          <button className="button is-primary is-light has-text-black is-outlined mt-3 ml-2" onClick={startOver}>Plan Another Vacation!</button>
      </div>
    </div>
  )
}


export default function VacationPlanResults ({ plans, setPlans }) {
  // this component renders a tab for each plan stored in the global state

  const location = useLocation();

  // the updatePlans function is passed down to the VacationPlanResult component so when the
  // user makes changes to the plan in the text area in that component those changes
  // are reflected when the user generates another plan and returns to that page
  const updatePlans = (updatedPlan) => {
    const updatedPlans = [...plans];
    for (let plan of updatedPlans) {
      if (plan.key == updatedPlan.key) {
        plan.text = updatedPlan.text;
        break;
      };
    };
    localStorage.setItem('plans', JSON.stringify(updatedPlans));
    setPlans(updatedPlans);
  }
  
  useEffect(() => {
    if (plans.length < 1) {
      console.log("no plans prop data")
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        console.log("setting vacation plans from local storage");
        setPlans(JSON.parse(savedPlans));
      };
    }
  }, [])

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container my-3">
          {/* TODO: use select dropdown and title instead of Tabs */}
          <Tabs defaultIndex={location.state?.planTabIndex || 0}>
            <TabList>
              {plans.map((plan, i) => {
                return (
                  <Tab key={i}>Plan {i+1}: {plan.location}</Tab>
                );
              })}
            </TabList>
            {plans.map((plan, i) => {
              return (
                <TabPanel key={i}>{<VacationPlanResult plan={plan} updatePlans={updatePlans}/>}</TabPanel>
              );
            })}
          </Tabs>
        </div>
      </div>
      <Footer />
    </section>
  )
}