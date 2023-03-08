import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { AiFillInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './tooltipStyle';

const recsURL = "http://localhost:5000/getRecommendations";
const planURL = "http://localhost:5000/getPlan"


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

  const fetchRecs = async (recType) => {
    return await fetch(recsURL, {
      method: "POST",
      body: JSON.stringify({
        "location": vacationLocation,
        "recommendationType": recType
      }
      ),
      headers: {
        "Content-Type": "application/json",
      }
    });
  }
  
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
    setIsLoading(true);
    setDisplayRecs(true);
    localStorage.setItem('displayRecs', true);

    // make the call to the OpenAI microservice here to get the recommendations
    const [thingsToDoResp, restaurantsResp] = await Promise.all([
      fetchRecs("thingsToDo"),
      fetchRecs("restaurants")
    ]);

    handleRecsResp(thingsToDoResp, setThingsToDoRecs, 'thingsToDoRecs');
    handleRecsResp(restaurantsResp, setRestaurantRecs, 'restaurantRecs');

    setIsLoading(false);
  }

  const getMoreRecs = async (e, recsType, recsStateVar, setRecsStateVarFn, localStorageKey) => {
    e.preventDefault();
    setIsLoading(true);
    const recsResp = await fetchRecs(recsType);
    if (recsResp.status === 200) {
      const respData = await recsResp.json();
      const moreRecs = respData.recs;
      const recs = [...recsStateVar];
      let numRecs = recs.length;
      for (let rec of moreRecs) {
        numRecs += 1;
        recs.push({
          key: numRecs,
          text: remLineNum(rec),
          checked: false
        });
      };
      setRecsStateVarFn(recs);
      localStorage.setItem(localStorageKey, JSON.stringify(recs));
    } else {
      window.alert("call to recommendation service failed")
    };
    setIsLoading(false);
  }
  
  const getVacationPlan = async (e) => {
    // make call to backend 
    e.preventDefault();
    setIsLoading(true);
    const selectedThingsToDo = thingsToDoRecs.filter(item => item.checked === true).map(item => item.text);
    const selectedRestaurants = restaurantRecs.filter(item => item.checked === true).map(item => item.text);
    const resp = await fetch(planURL, {
      method: "POST",
      body: JSON.stringify({
        thingsToDo: selectedThingsToDo,
        restaurants: selectedRestaurants,
        numDays: numDays
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    if (resp.status === 200) {
      const respData = await resp.json();
      const plan = respData.vacationPlan;
      
      const currPlans = [...plans];
      let numPlans = currPlans.length;
      currPlans.push({
        key: numPlans+1,
        text: plan, 
        location: vacationLocation
      });
      setPlans(currPlans);
      localStorage.setItem('plans', JSON.stringify(currPlans));
      navigate('/vacationPlanResults');
    } else {
      setIsLoading(false);
      window.alert(resp.text)
    }
  }

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
    <>
      <h2>Let's Plan Your Vacation!</h2>
      {isLoading ? <ClipLoader /> :
      <div id='recs-form'>
        <form onSubmit={getRecs}>

          <label>
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
            type='text'
            placeholder='Enter location...'
            value={vacationLocation}
            onChange={handleVacationLocationChange} 
            />
          </label>

          <br />
          <br />

          <label>
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
            type='number'
            placeholder='Enter # of travellers...'
            value={numTravellers}
            onChange={(e) => validateNumChange(e, setNumTravellers, 'numTravellers')}
            />
          </label>

          <br />
          <br />

          <label>
            How many days will you be travelling?&nbsp;
            <br />
            <input
            type='number'
            placeholder='Enter # of travel days...'
            value={numDays}
            onChange={(e) => validateNumChange(e, setNumDays, 'numDays')}
            />
          </label>

          <br />
          <br />

          {!displayRecs &&
          <>
          <button type='submit'>
            Get Recommendations!
          </button>
          <br />
          <br />
          </>}
        </form>

        {displayRecs &&
        <form onSubmit={getVacationPlan}>

          <div id='recs'>
            <h3>
              Things To Do
              <AiFillInfoCircle id='things-to-do-recs-tooltip' />
              <Tooltip
              style={tooltipStyle}
              html={thingsToDoRecsTooltipText}
              anchorId='things-to-do-recs-tooltip' 
              place='right'
              delayShow='300'
              delayHide='100' 
              />
            </h3>
            {thingsToDoRecs.map((thing, i) => {
              return (
                <>
                  <label>
                    <input 
                    type='checkbox' 
                    value={thing.key}
                    onChange={e => handleCheckboxChange(e, thingsToDoRecs, setThingsToDoRecs, 'thingsToDoRecs')}
                    checked={thing.checked}
                    key={i}
                    />
                    {thing.text}
                  </label>
                  <br />
                </>
            )})}
          </div>
          <br />
          <button onClick={(e) => getMoreRecs(e, "thingsToDo", thingsToDoRecs, setThingsToDoRecs, "thingsToDoRecs")}>
            Get more recommendations!
          </button>

          <br />

          <div className='recs'>
            <h3>
              Restaurants
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
                  <label>
                    <input
                    type='checkbox'
                    value={restaurant.key} 
                    onChange={e => handleCheckboxChange(e, restaurantRecs, setRestaurantRecs, 'restaurantRecs')}
                    checked={restaurant.checked}
                    key={i}
                    />
                    {restaurant.text}
                  </label>
                  <br />
                </>
            )})}
          </div>
          <br />
          <button onClick={(e) => getMoreRecs(e, "restaurants", restaurantRecs, setRestaurantRecs, "restaurantRecs")}>
            Get more recommendations!
          </button>
          

          <br />
          <br />
          <input type="submit" value='Get Vacation Plan!'/>
          &nbsp;
          <button onClick={startOver}>
            Start Over
          </button>
          &nbsp;
          <AiFillInfoCircle id='start-over-tooltip' />
          <Tooltip
          style={tooltipStyle}
          html={startOverTooltipText}
          anchorId='start-over-tooltip' 
          place='right'
          delayShow='300'
          delayHide='100' 
          />

        </form>
        }
      </div>
      }
    </>
  );
}
