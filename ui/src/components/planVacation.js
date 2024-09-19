import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Footer from './footer';
import * as tooltipText from "./tooltipText";
import InfoTooltip from './tooltip';
import { loadRecs, loadItinerary } from "./api";

const recType = {
  thingsToDo: "thingsToDo",
  restaurants: "restaurants",
}


const initialForm = {
  vacationLocation: "",
  numTravelers: 0,
  numDays: 0,
  [recType.thingsToDo]: [],
  [recType.restaurants]: [],
  displayRecs: false,
};


const Input = ({ className, type, name, placeholder, value, onChange }) => (
  <div className="control">
    <input
      className={className}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
)

const Checkbox = ({ rec, name, onChange }) => (
  <div className="control has-text" key={rec.key}>
    <input
      className="checkbox"
      type="checkbox"
      name={name}
      value={rec.key}
      checked={rec.checked}
      onChange={onChange}
    />
      {" " + rec.text}
  </div>
)

const SelectAllCheckbox= ({ name, handleSelectAll, formData }) => (
  <div className="control my-2">
    <input type="checkbox" name={name} onClick={handleSelectAll} checked={formData[name].every(rec => rec.checked)}/>
    &nbsp;<i><b>Select All</b></i>
  </div>
)

const Button = ({ text, margin, onClick }) => (
  <button 
    className={`button is-primary is-light has-text-black is-outlined ${margin}`}
    onClick={onClick}>
      {text}
  </button>
)

const Subtitle = ({ content }) => (
  <h2 className="subtitle has-text-black mb-2">
    {content}
  </h2>
)


const selectAllRecs = (e, form, setForm) => {
  const recs = [...form[e.target.name]];
  for (let rec of recs) {
    rec.checked = e.target.checked;
  };
  const updatedForm = {
    ...form,
    [e.target.name]: recs    
  };
  setForm(updatedForm)
  localStorage.setItem("form", JSON.stringify(updatedForm));
}


const updateForm = (e, form, setForm) => {
  let updatedForm;
  if (e.target.name === "numDays" || e.target.name === "numTravelers") {
    const num = parseInt(e.target.value);
    if (e.target.value !== "" && isNaN(num) || num < 0) {
      return;
    };
  };
  if (e.target.name === recType.thingsToDo || e.target.name === recType.restaurants) {
    const recs = [...form[e.target.name]];
    for (let rec of recs) {
      if (rec.key == e.target.value) {
        rec.checked = e.target.checked;
      };
    };
    updatedForm = {
      ...form,
      [e.target.name]: recs,
    };
  } else {;
    updatedForm = {
      ...form,
      [e.target.name]: e.target.value,
    };
  };
  setForm(updatedForm)
  localStorage.setItem("form", JSON.stringify(updatedForm));
}


const clearForm = (setForm) => {
  localStorage.removeItem("form");
  setForm({
    ...initialForm,
  });
}


const loadSavedForm = (setForm) => {
  const savedForm = JSON.parse(localStorage.getItem("form"));
  if (savedForm) {
    setForm({
      ...savedForm,
    });
  };
}


const navigateToCurrentPlans = (navigate, plans) => {
  if (plans.length < 1) {
    window.alert("No plans have been created yet");
  } else {
    navigate("/vacation-plan-results");
  };
}


function Form ({ plans, setPlans, setIsLoading }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ...initialForm,
  });

  const handleFormChange = (e) => updateForm(e, form, setForm);
  const handleLoadItinerary = () => loadItinerary(form, plans, setPlans, navigate, setIsLoading);
  const handleSelectAll = (e) => selectAllRecs(e, form, setForm);
  const handleLoadInitialRecs = () => loadRecs(form, setForm, setIsLoading, [recType.thingsToDo, recType.restaurants]);
  const handleLoadMoreThingsToDoRecs = () => loadRecs(form, setForm, setIsLoading, [recType.thingsToDo]);
  const handleLoadMoreRestaurantRecs = () => loadRecs(form, setForm, setIsLoading, [recType.restaurants]);
  const startOver = () => clearForm(setForm);
  const viewCurrentPlans = () => navigateToCurrentPlans(navigate, plans);
  
  useEffect(() => {
    loadSavedForm(setForm);
  }, [])

  return (
    <div className="box">
      <label>
        Where are you going?&nbsp;
        <InfoTooltip id="vacation-location-tooltip" text={tooltipText.vacationLocationText} />
      </label>
      <Input
        className="input mb-4"
        type="text"
        name="vacationLocation"
        placeholder="Enter location..."
        value={form.vacationLocation}
        onChange={handleFormChange}
      />
      <label>
        How many people are you travelling with?&nbsp;
        <InfoTooltip id="num-travelers-tooltip" text={tooltipText.numTravelersText} />
      </label>
      <Input
        className="input mb-4"
        type="number"
        name="numTravelers"
        placeholder="Enter # of travelers..."
        value={form.numTravelers}
        onChange={handleFormChange}
      />
      <label>
        How many days will you be travelling?&nbsp;
      </label>
      <Input
        className="input mb-4"
        type="number"
        name="numDays"
        placeholder="Enter # of travel days..."
        value={form.numDays}
        onChange={handleFormChange}
      />
      {!form.displayRecs && <Button margin="mt-4" text="Get Recommendations!" onClick={handleLoadInitialRecs}/>}
      {form.displayRecs && 
      <>
        <hr />
        <Subtitle content={
          <>
            Things To Do&nbsp;
            <InfoTooltip id="things-to-do-recs-tooltip" text={tooltipText.thingsToDoRecsTooltipText} />
          </>
        } />
        <SelectAllCheckbox name={recType.thingsToDo} handleSelectAll={handleSelectAll} formData={form} />
        {form.thingsToDo.map(thing => {
          return (
            <Checkbox
              rec={thing}
              name={recType.thingsToDo}
              onChange={handleFormChange}
            />
        )})}
        <Button text="Get more recommendations!" margin="mt-4" onClick={handleLoadMoreThingsToDoRecs} />
        <hr />
        <Subtitle content={
          <>
            Restaurants&nbsp;
            <InfoTooltip id="restaurant-recs-tooltip" text={tooltipText.restaurantRecsTooltipText} />&nbsp;
          </>
        } />
        <SelectAllCheckbox name={recType.restaurants} handleSelectAll={handleSelectAll} formData={form}/>
        {form.restaurants.map(restaurant => {
          return (
            <Checkbox
              rec={restaurant}
              name={recType.restaurants}
              onChange={handleFormChange}
            />
        )})}
        <Button text="Get more recommendations!" margin="mt-4" onClick={handleLoadMoreRestaurantRecs} />
        <hr />
        <div className="is-flex is-align-content-left is-align-content-space-between is-flex-wrap-wrap">
          <Button text="Get Vacation Plan!" onClick={handleLoadItinerary} />
          <Button text="View Current Plans" margin="mx-2" onClick={viewCurrentPlans} />
          <Button text="Start Over" onClick={startOver} />
        </div>
      </>}
    </div>
  )
}


export default function PlanVacation ({ plans, setPlans }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container is-flex is-flex-direction-column is-justify-content-center">
          {isLoading && <ClipLoader size={75} color="white" cssOverride={{ display: "block", margin: "0 auto" }}/> }
          {!isLoading && 
            <>
              <p className="title m-4">Let's Plan Your Vacation!</p>
              <Form plans={plans} setPlans={setPlans} setIsLoading={setIsLoading} />
            </>}
        </div>
      </div>
      <Footer />
    </section>
  );
}
