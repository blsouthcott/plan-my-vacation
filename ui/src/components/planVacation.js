import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { AiFillInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './tooltipStyle';

const recsURL = "http://localhost:5000/recommendations";
const planURL = "http://localhost:5000/itinerary"


export default function VacationForm ({ plans, setPlans }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [vacationLocation, setVacationLocation] = useState('');
  const [numTravellers, setNumTravellers] = useState('');
  const [numDays, setNumDays] = useState('');
  const [thingsToDoRecs, setThingsToDoRecs] = useState([]);
  const [restaurantRecs, setRestaurantRecs] = useState([]);
  const [displayRecs, setDisplayRecs] = useState(false);

  // tooltip text
  const vacationLocationText = 'We can provide recommendations specific to cities or general areas, so you don\'t have to be specific if you don\'t know exactly where you\'ll be going!'
  const numTravellersText = 'Telling us how many travellers you\'ll be travelling with helps us provide recommendations and ultimately craft a plan most tailored to you!'
  const thingsToDoRecsTooltipText = '<p>Choose from the following recommendations or to see more recommendations click "Get more recommendations"</p><p>We\'ll use your choices to create a vacation plan tailored to you!</p>'
  const restaurantRecsTooltipText = '<p>Choose from the following restaurants or to see more restaurant recommendations click "Get more recommendations"</p><p>We\'ll use your choices to create a vacation plan tailored to you!</p>'
  const startOverTooltipText = 'If you choose to Start Over, all the information you\'ve entered so far will be lost, including your recommendations and selections.'

  // the keys and functions we'll use to display the data the user input on page reloads
  const localStorageObjs = [
    {
      key: "vacationLocation",
      setStateVarFn: setVacationLocation,
      parseJSON: false,
    },
    {
      key: "numTravellers",
      setStateVarFn: setNumTravellers,
      parseJSON: false,
    },
    {
      key: "displayRecs",
      setStateVarFn: setDisplayRecs,
      parseJSON: false,
    },
    {
      key: "thingsToDoRecs",
      setStateVarFn: setThingsToDoRecs,
      parseJSON: true,
    },
    {
      key: "restaurantRecs",
      setStateVarFn: setRestaurantRecs,
      parseJSON: true,
    },
    {
      key: "numDays",
      setStateVarFn: setNumDays,
      parseJSON: false
    },
  ]

  const fetchRecs = async (body) => {
    return await fetch(recsURL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    });
  }
  
  // updates the state after making the request to the microservice to get recommendations
  const handleRecsResp = async (resp, setStateVarFn, localStorageKey) => {
    if (resp.status === 200) {
      const respData = await resp.json();
      let recs = respData.recs;
      recs = recsArrayToObjs(recs);
      setStateVarFn(recs);
      localStorage.setItem(localStorageKey, JSON.stringify(recs));
    } else {
      window.alert("Unable to load data for " + localStorageKey);
    }
  }
  
  const remLineNum = (rec) => {
    const lineNumRegex = /^\d+\.\s*/;
    return rec.replace(lineNumRegex, '');
  }
  
  const recsArrayToObjs = (recsArray) => {
    const recObjs = [];
    let numRec = 0;
    for (let rec of recsArray) {
      recObjs.push({
        key: numRec,
        text: remLineNum(rec),
        checked: false
      })
      numRec += 1;
    }
    return recObjs;
  }

  const validateNumChange = (e, setVarFn, localStorageKey) => {
    e.target.value >= 1 && setVarFn(e.target.value);
    e.target.value >= 1 && localStorage.setItem(localStorageKey, e.target.value);
  }

  const handleVacationLocationChange = (e) => {
    setVacationLocation(e.target.value);
    localStorage.setItem('vacationLocation', e.target.value);
  }

  const handleCheckboxChange = (e, stateVar, setStateVar, localStorageKey) => {
    console.log('checked: ', e.target.checked);
    const recs = [...stateVar];
    for (let rec of recs) {
      if (rec.key == e.target.value) {
        console.log('found item')
        rec.checked = e.target.checked;
      };
    }
    setStateVar(recs);
    localStorage.setItem(localStorageKey, JSON.stringify(recs));
  }

  const getRecs = async (e) => {
    e.preventDefault();
    if (!vacationLocation || numDays < 1) {
      window.alert("You must provide a vacation location and number of travel days");
      return;
    };
    setIsLoading(true);
    setDisplayRecs(true);
    localStorage.setItem('displayRecs', true);

    // make the call to the OpenAI microservice here to get the recommendations
    const [thingsToDoResp, restaurantsResp] = await Promise.all([
      fetchRecs({
        location: vacationLocation,
        rec_type: "thingsToDo"
      }),
      fetchRecs({
        location: vacationLocation,
        rec_type: "restaurants"
      })
    ]);

    handleRecsResp(thingsToDoResp, setThingsToDoRecs, 'thingsToDoRecs');
    handleRecsResp(restaurantsResp, setRestaurantRecs, 'restaurantRecs');

    setIsLoading(false);
  }

  const getMoreRecs = async (e, recsType, recsStateVar, setRecsStateVarFn, localStorageKey) => {
    e.preventDefault();
    setIsLoading(true);
    const recsResp = await fetchRecs({
      location: vacationLocation,
      rec_type: recsType,
      exclusions: recsStateVar.map(rec => rec.text)
    });
    if (recsResp.status === 200) {
      const respData = await recsResp.json();
      const moreRecs = respData.recs;
      const recs = [...recsStateVar];
      let numRecs = recs.length;
      for (let newRec of moreRecs) {
        newRec = remLineNum(newRec);
        const dupRecs = recs.filter(rec => rec.text === newRec);
        if (dupRecs.length === 0) {
          numRecs += 1;
          recs.push({
            key: numRecs,
            text: remLineNum(newRec),
            checked: false
          });
        };
      };
      setRecsStateVarFn(recs);
      localStorage.setItem(localStorageKey, JSON.stringify(recs));
    } else {
      window.alert("call to recommendation service failed")
    };
    setIsLoading(false);
  }

  const fetchVacationPlan = async (body) => {
    const resp = await fetch(planURL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    })
    return resp;
  }

  // updates the plans in the global state so users can refer to previously generated plans
  const updatePlans = (newPlan) => {
    const currPlans = [...plans];
    let numPlans = currPlans.length;
    currPlans.push({
      key: numPlans+1,
      text: newPlan, 
      location: vacationLocation
    });
    setPlans(currPlans);
    localStorage.setItem('plans', JSON.stringify(currPlans));
  }
  
  // makes call to microservice and then takes the user to see the vacation plan results
  const getAndViewPlan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const resp = await fetchVacationPlan({
      things_to_do: thingsToDoRecs.filter(item => item.checked === true).map(item => item.text),
      restaurants: restaurantRecs.filter(item => item.checked === true).map(item => item.text),
      num_days: numDays
    });
    if (resp.status === 200) {
      const respData = await resp.json();
      const newPlan = respData.itinerary;
      updatePlans(newPlan);
      navigate('/vacationPlanResults');
    } else {
      setIsLoading(false);
      window.alert(resp.text)
    };
  }

  const viewCurrentPlans = (e) => {
    e.preventDefault();
    if (plans.length < 1) {
      window.alert('No plans have been created yet');
    } else {
      navigate('/vacationPlanResults');
    };
  }

  // clears the data in the form but leaves the plans in the global state unchanged
  const startOver = (e) => {
    e.preventDefault();
    for (let obj of localStorageObjs) {
      localStorage.removeItem(obj.key);
    }
    setDisplayRecs(false);
    setVacationLocation('');
    setNumTravellers('');
    setNumDays('');
    setThingsToDoRecs([]);
    setRestaurantRecs([]);
  }

  useEffect(() => {
    for (let obj of localStorageObjs) {
      let saved = localStorage.getItem(obj.key);
      if (saved) {
        if (obj.parseJSON) {
          saved = JSON.parse(saved);
        }
        obj.setStateVarFn(saved);
      };
    };
  }, [])

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container">
          <h1 style={{ display: isLoading ? 'none' : 'block' }} className="title m-4">Let's Plan Your Vacation!</h1>
          {isLoading ? <ClipLoader size={75} color="white" cssOverride={{ display: "block", margin: "0 auto" }}/> :
          <div className="columns">
            <div className="column is-half">
            <div className="box">
              <label className="">
                Where are you going?&nbsp;
                <AiFillInfoCircle id='vacation-location-tooltip' data-tooltip-content={vacationLocationText} />
                <Tooltip
                  style={tooltipStyle}
                  anchorId='vacation-location-tooltip' 
                  place='right' 
                  delayShow='300' 
                  delayHide='100'
                />
                <br />
                <input
                  className="input mb-4"
                  type='text'
                  placeholder='Enter location...'
                  value={vacationLocation}
                  onChange={handleVacationLocationChange} 
                />
              </label>
              <label className="">
                How many people are you travelling with?&nbsp;
                <AiFillInfoCircle id='num-travellers-tooltip' />
                <Tooltip
                  style={tooltipStyle}
                  content={numTravellersText}
                  anchorId='num-travellers-tooltip' 
                  place='right'
                  delayShow='300' 
                  delayHide='100' 
                />
                <br />
                <input
                  className="input mb-4"
                  type='number'
                  placeholder='Enter # of travellers...'
                  value={numTravellers}
                  onChange={(e) => validateNumChange(e, setNumTravellers, 'numTravellers')}
                />
              </label>
              <label className="">
                How many days will you be travelling?&nbsp;
                <br />
                <input
                  className="input mb-4"
                  type='number'
                  placeholder='Enter # of travel days...'
                  value={numDays}
                  onChange={(e) => validateNumChange(e, setNumDays, 'numDays')}
                />
              </label>
              {!displayRecs &&
              <>
                <button className="button is-primary is-light has-text-black is-outlined mt-4" onClick={getRecs}>
                  Get Recommendations!
                </button>
              </>}
            </div>

            {displayRecs &&
            <>
              <div className="box">
                <p className="subtitle has-text-black">
                  Things To Do&nbsp;
                  <AiFillInfoCircle id='things-to-do-recs-tooltip' />
                  <Tooltip
                    style={tooltipStyle}
                    html={thingsToDoRecsTooltipText}
                    anchorId='things-to-do-recs-tooltip' 
                    place='right'
                    delayShow='300'
                    delayHide='100' 
                  />
                </p>
                {thingsToDoRecs.map((thing, i) => {
                  return (
                    <>
                      <label className="has-text">
                        <input 
                          className="checkbox"
                          type='checkbox' 
                          value={thing.key}
                          onChange={e => handleCheckboxChange(e, thingsToDoRecs, setThingsToDoRecs, 'thingsToDoRecs')}
                          checked={thing.checked}
                          key={i}
                        />
                        {" " + thing.text}
                      </label>
                      <br />
                    </>
                )})}
                <button 
                  onClick={(e) => getMoreRecs(e, "thingsToDo", thingsToDoRecs, setThingsToDoRecs, "thingsToDoRecs")}
                  className="button is-primary is-light has-text-black is-outlined mt-4"
                >
                  Get more recommendations!
                </button>
              </div>

              <div className="box">
                <h3 className="subtitle has-text-black">
                  Restaurants&nbsp;
                  <AiFillInfoCircle id='restaurant-recs-tooltip' />
                  <Tooltip
                    style={tooltipStyle}
                    html={restaurantRecsTooltipText}
                    anchorId='restaurant-recs-tooltip' 
                    place='right'
                    delayShow='300'
                    delayHide='100' 
                  />
                </h3>
                {restaurantRecs.map((restaurant, i) => {
                  return (
                    <>
                      <label className="has-text-black">
                        <input
                          className="checkbox"
                          type='checkbox'
                          value={restaurant.key} 
                          onChange={e => handleCheckboxChange(e, restaurantRecs, setRestaurantRecs, 'restaurantRecs')}
                          checked={restaurant.checked}
                          key={i}
                        />
                        {" " + restaurant.text}
                      </label>
                      <br />
                    </>
                )})}

                <button 
                  onClick={(e) => getMoreRecs(e, "restaurants", restaurantRecs, setRestaurantRecs, "restaurantRecs")}
                  className="button is-primary is-light has-text-black is-outlined mt-4"
                >
                  Get more recommendations!
                </button>
              </div>

              <div className="box">
                <div className="columns">
                  <div className="column is-one-third">
                    <button className="button is-primary is-light has-text-black is-outlined" onClick={getAndViewPlan}>Get Vacation Plan!</button>
                  </div>
                  <div className="column is-one-third">
                    <button className="button is-primary is-light has-text-black is-outlined" onClick={viewCurrentPlans}>
                      View Current Plans
                    </button>
                  </div>
                  <div className="column is-one-third">
                    <button className="button is-primary is-light has-text-black is-outlined" onClick={startOver}>
                      Start Over
                    </button>
                    <AiFillInfoCircle id='start-over-tooltip' />
                    <Tooltip
                      style={tooltipStyle}
                      html={startOverTooltipText}
                      anchorId='start-over-tooltip' 
                      place='right'
                      delayShow='300'
                      delayHide='100' 
                    />
                  </div>
                </div>
              </div>
            </>}
            </div>
          </div>}
        </div>
      </div>
    </section>
  );
}
