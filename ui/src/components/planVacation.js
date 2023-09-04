import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { AiFillInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './tooltipStyle';
import Footer from './footer';
import * as tooltipText from "./tooltipText";


export default function VacationForm ({ plans, setPlans }) {
  const navigate = useNavigate();

  const initialForm = {
    vacationLocation: "",
    numTravelers: 0,
    numDays: 0,
    thingsToDoRecs: [],
    restaurantRecs: [],
    displayRecs: false,
  }

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    ...initialForm,
  });

  const handleFormChange = (e) => {
    let updatedForm;
    if (["thingsToDoRecs", "restaurantRecs"].includes(e.target.name)) {
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
    setForm({
      ...updatedForm,
    });
    localStorage.setItem("form", JSON.stringify({
      ...updatedForm,
    }))
  }

  const fetchRecs = async (body) => {
    return await fetch("/api/recommendations", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    });
  }
  
  const handleRecsResp = async (resp) => {
    if (resp.status === 200) {
      const data = await resp.json();
      let recs = data.recs;
      recs = recsArrayToObjs(recs);
      return recs;
    } else if (resp.status === 429) {
      const data = await resp.json();
      window.alert("You have exceeded your current request limit: " + data.message)
    } else {
      window.alert("Unable to load recommendations");
    };
    return [];
  }
  
  const sanitizeRecText = (rec) => {
    const lineNumRegex = /^\d+\.\s*/;
    rec = rec.replace(lineNumRegex, "").trim();
    if (rec.endsWith(".")) {
      rec = rec.slice(0, -1);
    };
    if (rec.startsWith("-")) {
      rec = rec.slice(1);
    }
    return rec.trim();
  }
  
  const recsArrayToObjs = (recsArray) => {
    const recObjs = [];
    let numRec = 0;
    for (let rec of recsArray) {
      recObjs.push({
        key: numRec,
        text: sanitizeRecText(rec),
        checked: false
      })
      numRec += 1;
    }
    return recObjs;
  }

  const getRecs = async () => {
    if (!form.vacationLocation || form.numDays < 1) {
      window.alert("Please provide a vacation location and number of travel days greater than 1 before requesting recommendations");
      return;
    };
    setIsLoading(true);
    const [thingsToDoResp, restaurantsResp] = await Promise.all([
      fetchRecs({
        location: form.vacationLocation,
        rec_type: "thingsToDo"
      }),
      fetchRecs({
        location: form.vacationLocation,
        rec_type: "restaurants"
      })
    ]);
    const thingsToDoRecs = await handleRecsResp(thingsToDoResp);
    const restaurantRecs = await handleRecsResp(restaurantsResp);
    const updatedForm = {
      ...form,
      thingsToDoRecs: thingsToDoRecs,
      restaurantRecs: restaurantRecs,
      displayRecs: true,
    };
    setForm({
      ...updatedForm,
    });
    localStorage.setItem("form", JSON.stringify({
      ...updatedForm,
    }))
    setIsLoading(false);
  }

  const getMoreRecs = async (recsName) => {
    setIsLoading(true);
    const resp = await fetchRecs({
      location: form.vacationLocation,
      rec_type: recsName === "thingsToDoRecs" ? "thingsToDo" : "restaurants",
      exclusions: form[recsName].map(rec => rec.text)
    });
    if (resp.status === 200) {
      const data = await resp.json();
      const currRecs = [...form[recsName]];
      let numRecs = currRecs.length;
      for (let rec of data.recs) {
        rec = sanitizeRecText(rec);
        const dupRecs = currRecs.filter(currRec => currRec.text === rec);
        if (dupRecs.length === 0) {
          numRecs += 1;
          currRecs.push({
            key: numRecs,
            text: rec,
            checked: false
          });
        };
      };
      const updatedForm = {
        ...form,
        [recsName]: currRecs,
      }
      setForm({
        ...updatedForm,
      });
      localStorage.setItem("form", JSON.stringify({
        ...updatedForm,
      }));
    } else if (resp.status === 429) {
      const data = await resp.json();
      window.alert("You have exceeded your current request limit: " + data.message)
    } else {
      const text = await resp.text();
      window.alert(text);
    };
    setIsLoading(false);
  }

  const fetchVacationPlan = async (body) => {
    const resp = await fetch("/api/itinerary", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    });
    return resp;
  }

  const updatePlans = (newPlan) => {
    const currPlans = [...plans];
    let numPlans = currPlans.length;
    currPlans.push({
      key: numPlans+1,
      text: newPlan, 
      location: form.vacationLocation
    });
    setPlans(currPlans);
    localStorage.setItem("plans", JSON.stringify(currPlans));
  }
  
  const getAndViewPlan = async () => {
    setIsLoading(true);
    const resp = await fetchVacationPlan({
      things_to_do: form.thingsToDoRecs.filter(item => item.checked === true).map(item => item.text),
      restaurants: form.restaurantRecs.filter(item => item.checked === true).map(item => item.text),
      num_days: form.numDays
    });
    if (resp.status === 200) {
      const data = await resp.json();
      const newPlan = data.itinerary;
      updatePlans(newPlan);
      navigate("/vacation-plan-results", {state: {planTabIndex: plans.length}});
    } else if (resp.status === 429) {
      const data = await resp.json();
      window.alert("You have exceeded your current request limit: " + data.message)
    } else {
      const text = await resp.text();
      window.alert(text);
    };
    setIsLoading(false);
  }

  const viewCurrentPlans = () => {
    if (plans.length < 1) {
      window.alert("No plans have been created yet");
    } else {
      navigate("/vacation-plan-results");
    };
  }

  const startOver = () => {
    localStorage.removeItem("form");
    setForm({
      ...initialForm,
    });
  }

  useEffect(() => {
    const savedForm = JSON.parse(localStorage.getItem("form"));
    if (savedForm) {
      setForm({
        ...savedForm,
      });
    };
  }, [])

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container is-flex is-flex-direction-column is-justify-content-center">
          {isLoading ? <ClipLoader size={75} color="white" cssOverride={{ display: "block", margin: "0 auto" }}/> :
          <>
            <p className="title m-4">Let's Plan Your Vacation!</p>
            <div className="box">
              <label>Where are you going?&nbsp;
              <AiFillInfoCircle id="vacation-location-tooltip" data-tooltip-content={tooltipText.vacationLocationText} />
              <Tooltip
                  style={tooltipStyle}
                  anchorId="vacation-location-tooltip" 
                  place="right" 
                  delayShow="300" 
                  delayHide="100"
                />
              </label>
              <div className="control">
                <input
                  className="input mb-4"
                  type="text"
                  name="vacationLocation"
                  placeholder="Enter location..."
                  value={form.vacationLocation}
                  onChange={handleFormChange} 
                />
              </div>
              <label>How many people are you travelling with?&nbsp;
                <AiFillInfoCircle id="num-travellers-tooltip" />
                <Tooltip
                  style={tooltipStyle}
                  content={tooltipText.numTravellersText}
                  anchorId="num-travellers-tooltip" 
                  place="right"
                  delayShow="300" 
                  delayHide="100" 
                />
              </label>
              <div className="control">
                <input
                  className="input mb-4"
                  type="number"
                  name="numTravelers"
                  placeholder="Enter # of travelers..."
                  value={form.numTravelers}
                  onChange={handleFormChange}
                />
              </div>
              <label>
                How many days will you be travelling?&nbsp;
              </label>
              <div className="control">
                <input
                  className="input mb-4"
                  type="number"
                  name="numDays"
                  placeholder="Enter # of travel days..."
                  value={form.numDays}
                  onChange={handleFormChange}
                />
              </div>
              {!form.displayRecs &&
              <>
                <button className="button is-primary is-light has-text-black is-outlined mt-4" onClick={getRecs}>
                  Get Recommendations!
                </button>
              </>}
              
              {form.displayRecs && 
              <>
                <hr />
                <h2 className="subtitle has-text-black mb-2">
                  Things To Do&nbsp;
                  <AiFillInfoCircle id="things-to-do-recs-tooltip" />
                  <Tooltip
                    style={tooltipStyle}
                    html={tooltipText.thingsToDoRecsTooltipText}
                    anchorId="things-to-do-recs-tooltip" 
                    place="right"
                    delayShow="300"
                    delayHide="100" 
                  />
                </h2>

                {form.thingsToDoRecs.map(thing => {
                  return (
                    <div className="control has-text" key={thing.key}>
                      <input 
                        className="checkbox"
                        type="checkbox"
                        name="thingsToDoRecs"
                        value={thing.key}
                        onChange={handleFormChange}
                        checked={thing.checked}
                      />
                      {" " + thing.text}
                    </div>
                )})}
                <button 
                  onClick={() => getMoreRecs("thingsToDoRecs")}
                  className="button is-primary is-light has-text-black is-outlined mt-4">
                  Get more recommendations!
                </button>
                
                <hr />

                <h2 className="subtitle has-text-black mb-2">
                  Restaurants&nbsp;
                  <AiFillInfoCircle id="restaurant-recs-tooltip" />
                  <Tooltip
                    style={tooltipStyle}
                    html={tooltipText.restaurantRecsTooltipText}
                    anchorId="restaurant-recs-tooltip" 
                    place="right"
                    delayShow="300"
                    delayHide="100" 
                  />&nbsp;
                </h2>

                {form.restaurantRecs.map(restaurant => {
                  return (
                    <div className="control has-text" key={restaurant.key}>
                      <input
                        className="checkbox"
                        type="checkbox"
                        name="restaurantRecs"
                        value={restaurant.key} 
                        onChange={handleFormChange}
                        checked={restaurant.checked}
                      />
                      {" " + restaurant.text}
                    </div>
                )})}
                <button 
                  onClick={() => getMoreRecs("restaurantRecs")}
                  className="button is-primary is-light has-text-black is-outlined mt-4">
                  Get more recommendations!
                </button>

                <hr />
                  
                <div className="is-flex is-align-content-left is-align-content-space-between is-flex-wrap-wrap">
                  <button className="button is-primary is-light has-text-black is-outlined" onClick={getAndViewPlan}>
                    Get Vacation Plan!
                  </button>
                  <button className="button mx-2 is-full-mobile is-primary is-light has-text-black is-outlined" onClick={viewCurrentPlans}>
                    View Current Plans
                  </button>
                  <button className="button is-full-mobile is-primary is-light has-text-black is-outlined" onClick={startOver}>
                    Start Over
                  </button>
                </div>
              </>}
            </div>
          </>}
        </div>
      </div>
      <Footer />
    </section>
  );
}
