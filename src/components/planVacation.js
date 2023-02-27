import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { AiFillInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './tooltipStyle';

const recsURL = "http://localhost:5000/getRecommendations";
const planURL = "http://localhost:5000/getPlan"

// tooltip text
const vacationLocationText = 'We can provide recommendations specific to cities or general areas, so you don\'t have to be specific if you don\'t know exactly where you\'ll be going!'
const numTravellersText = 'Telling us how many travellers you\'ll be travelling with helps us provide recommendations and ultimately craft a plan most tailored to you!'
const thingsToDoRecsTooltipText = '<p>Choose from the following recommendations or to see more recommendations click "Get more recommendations"</p><p>We\'ll use your choices to create a vacation plan tailored to you!</p>'
const restaurantRecsTooltipText = '<p>Choose from the following restaurants or to see more restaurant recommendations click "Get more recommendations"</p><p>We\'ll use your choices to create a vacation plan tailored to you!</p>'
const startOverTooltipText = 'If you choose to Start Over, all the information you\'ve entered so far will be lost, including your recommendations and selections.'

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

export default function VacationForm ({ setPlan }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [vacationLocation, setVacationLocation] = useState('');
  const [numTravellers, setNumTravellers] = useState('');
  const [numDays, setNumDays] = useState('');
  const [thingsToDoRecs, setThingsToDoRecs] = useState([]);
  const [restaurantRecs, setRestaurantRecs] = useState([]);

  const [displayRecs, setDisplayRecs] = useState(false);

  const handleNumTravellersChange = async (e) => {
    e.target.value >= 1 && setNumTravellers(e.target.value);
    e.target.value >= 1 && localStorage.setItem('numTravellers', e.target.value);
  }

  const handleNumDaysChange = async (e) => {
    e.target.value >= 1 && setNumDays(e.target.value);
    e.target.value >= 1 && localStorage.setItem('numDays', e.target.value);
  }

  const handleVacationLocationChange = async (e) => {
    setVacationLocation(e.target.value);
    localStorage.setItem('vacationLocation', e.target.value);
  }

  const handleThingToDoCheckBoxChange = (e) => {
    console.log('checked: ', e.target.checked);
    const recs = [...thingsToDoRecs];
    for (let rec of recs) {
      if (rec.key == e.target.value) {
        console.log('found item')
        rec.checked = e.target.checked;
      };
    }
    setThingsToDoRecs(recs);
    localStorage.setItem('thingsToDoRecs', JSON.stringify(recs));
  }

  const handleRestaurantRecCheckboxChange = (e) => {
    console.log('checked: ', e.target.checked);
    const recs = [...restaurantRecs];
    for (let rec of recs) {
      if (rec.key == e.target.value) {
        rec.checked = e.target.checked;
      };
    }
    setRestaurantRecs(recs);
    localStorage.setItem('restaurantRecs', JSON.stringify(recs));
  }

  const getRecs = async (e) => {
    e.preventDefault();

    console.log('Vacation location: ', vacationLocation);
    console.log('Number of travellers: ', numTravellers);

    setIsLoading(true);
    setDisplayRecs(true);
    localStorage.setItem('displayRecs', true);

    // make the call to the OpenAI microservice here to get the recommendations
    const [thingsToDoResp, restaurantsResp] = await Promise.all([
      fetch(recsURL, {
        method: "POST",
        body: JSON.stringify({
          "location": vacationLocation,
          "recommendationType": "thingsToDo"
        }
        ),
        headers: {
          "Content-Type": "application/json",
        }
      }),
      fetch(recsURL, {
        method: "POST",
        body: JSON.stringify({
          "location": vacationLocation,
          "recommendationType": "restaurants"
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }),
    ])

    if (thingsToDoResp.status === 200) {
      const respData = await thingsToDoResp.json();
      let recs = respData.recs;
      recs = recsArrayToObjs(recs);
      setThingsToDoRecs(recs);
      localStorage.setItem('thingsToDoRecs', JSON.stringify(recs));
    };

    if (restaurantsResp.status === 200) {
      const respData = await restaurantsResp.json();
      let recs = respData.recs;
      recs = recsArrayToObjs(recs);
      setRestaurantRecs(recs);
      localStorage.setItem('restaurantRecs', JSON.stringify(recs));
    };

    // setTimeout(() => setIsLoading(false), 1000);
    setIsLoading(false);
  }

  const getMoreThingsToDoRecs = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const moreRecsResp = await fetch(recsURL, {
      method: "POST",
      body: JSON.stringify({
        "location": vacationLocation,
        "recommendationType": "thingsToDo"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    if (moreRecsResp.status === 200) {
      const respData = await moreRecsResp.json();
      const moreRecs = respData.recs;
      const recs = [...thingsToDoRecs]
      let numRecs = recs.length
      for (let rec of moreRecs) {
        numRecs += 1;
        recs.push({
          key: numRecs,
          text: remLineNum(rec),
          checked: false
        });
      };
      setThingsToDoRecs(recs);
      localStorage.setItem('thingsToDoRecs', JSON.stringify(recs));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      window.alert("call to recommendation service failed")
    }
  }

  const getMoreRestaurantRecs = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const moreRecsResp = await fetch(recsURL, {
      method: "POST",
      body: JSON.stringify({
        "location": vacationLocation,
        "recommendationType": "restaurants"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    if (moreRecsResp.status === 200) {
      const respData = await moreRecsResp.json();
      const moreRecs = respData.recs;
      const recs = [...restaurantRecs]
      let numRecs = recs.length
      for (let rec of moreRecs) {
        numRecs += 1;
        recs.push({
          key: numRecs,
          text: remLineNum(rec),
          checked: false
        });
      }
      setRestaurantRecs(recs);
      localStorage.setItem('restaurantRecs', JSON.stringify(recs));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      window.alert("call to recommendation service failed")
    }
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
      console.log("plan: ", plan)
      setPlan(plan);
      navigate('/vacationPlanResults');
    } else {
      setIsLoading(false);
      window.alert(resp.text)
    }
  }

  const startOver = (e) => {
    e.preventDefault();
    localStorage.clear();
    setDisplayRecs(false);
    setVacationLocation('');
    setNumTravellers('');
    setNumDays('');
    setThingsToDoRecs([]);
    setRestaurantRecs([]);
  }

  useEffect(() => {
    const savedVacationLocation = localStorage.getItem('vacationLocation');
    console.log('saved vacation location: ', savedVacationLocation);
    if (savedVacationLocation) {
      setVacationLocation(savedVacationLocation);
    };
    const savedNumTravellers = localStorage.getItem('numTravellers');
    console.log('saved # of travellers: ', savedNumTravellers);
    if (savedNumTravellers) {
      setNumTravellers(savedNumTravellers);
    };
    const savedDisplayRecs = localStorage.getItem('displayRecs');
    console.log('saved display recs: ', savedDisplayRecs)
    if (savedDisplayRecs) {
      setDisplayRecs(Boolean(savedDisplayRecs));
    };
    const savedThingsToDoRecs = localStorage.getItem('thingsToDoRecs');
    console.log('saved things to do recs: ', savedThingsToDoRecs)
    if (savedThingsToDoRecs) {
      setThingsToDoRecs(JSON.parse(savedThingsToDoRecs));
    };
    const savedRestaurantRecs = localStorage.getItem('restaurantRecs');
    console.log('saved restaurant recs: ', savedRestaurantRecs)
    if (savedRestaurantRecs) {
      setRestaurantRecs(JSON.parse(savedRestaurantRecs));
    };
    const savedNumDays = localStorage.getItem('numDays');
    console.log('saved num travel days: ', savedNumDays)
    if (savedNumDays) {
      setNumDays(JSON.parse(savedNumDays));
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
            onChange={(e) => handleNumTravellersChange(e)}
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
            onChange={(e) => handleNumDaysChange(e)}
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
                    onChange={e => handleThingToDoCheckBoxChange(e)}
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
          <button onClick={getMoreThingsToDoRecs}>
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
                    onChange={e => handleRestaurantRecCheckboxChange(e)}
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
          <button onClick={getMoreRestaurantRecs}>
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
