import React, { useEffect } from "react";
import VacationPlanResult from "./vacationPlanResult";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default function VacationPlanResults ({ plans, setPlans }) {
  const updatePlans = (updatedPlan) => {
    const updatedPlans = [...plans];
    for (let plan of updatedPlans) {
      if (plan.key == updatedPlan.key) {
        plan.text = updatedPlan.text;
        break;
      };
    }
    localStorage.setItem('plans', JSON.stringify(updatedPlans));
    setPlans(updatedPlans);
  }
  
  useEffect(() => {
    if (plans.length < 1) {
      console.log("no plans prop data")
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        console.log("setting plans to: ", savedPlans)
        setPlans(JSON.parse(savedPlans));
      };
    }
  }, [])

  return (
    <Tabs>
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
  )
}