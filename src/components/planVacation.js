import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { AiFillInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './tooltipStyle';


const mockThingsToDoData = [
  {
    key: 1, 
    text: 'Walk around Central Park',
    checked: false
  },
  {
    key: 2,
    text: 'Go to the Empire State Building',
    checked: false
  },
  {
    key: 3,
    text: 'Go to Smalls Jazz Club',
    checked: false
  }
]

const mockMoreThingsToDoData = [
  'Go to Times Square',
  'Go to Coney Island',
  'Go to 9/11 Memorial'
]

const mockRestaurantsData = [
  {
    key: 1,
    text: 'Katz\'s Delicatessen',
    checked: false
  },
  {
    key: 2,
    text: 'Keens Steakhouse',
    checked: false
  },
  {
    key: 3,
    text: 'The Russian Tea Room',
    checked: false
  }
]

const mockMoreRestaurantsData = [
  'Boucherie Union Square',
  'COTE Korean Steakhouse',
  'Le Coucou'
]

// tooltip text
const vacationLocationText = 'We can provide recommendations specific to cities or general areas, so you don\'t have to be specific if you don\'t know exactly where you\'ll be going!'
const numTravellersText = 'Telling us how many travellers you\'ll be travelling with helps us provide recommendations and ultimately craft a plan most tailored to you!'
const thingsToDoRecsTooltipText = '<p>Choose from the following recommendations or to see more recommendations click "Get more recommendations"</p><p>We\'ll use your choices to create a vacation plan tailored to you!</p>'
const restaurantRecsTooltipText = '<p>Choose from the following restaurants or to see more restaurant recommendations click "Get more recommendations"</p><p>We\'ll use your choices to create a vacation plan tailored to you!</p>'
const startOverTooltipText = 'If you choose to Start Over, all the information you\'ve entered so far will be lost, including your recommendations and selections.'


export default function VacationForm ({ setPlan }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [vacationLocation, setVacationLocation] = useState('');
  const [numTravellers, setNumTravellers] = useState('');
  const [thingsToDoRecs, setThingsToDoRecs] = useState([]);
  const [restaurantRecs, setRestaurantRecs] = useState([]);

  const [displayRecs, setDisplayRecs] = useState(false);

  const handleNumTravellersChange = async (e) => {
    e.target.value >= 1 && setNumTravellers(e.target.value);
    e.target.value >= 1 && localStorage.setItem('numTravellers', e.target.value);
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

  const getRecs = (e) => {
    e.preventDefault();

    console.log('Vacation location: ', vacationLocation);
    console.log('Number of travellers: ', numTravellers);

    setIsLoading(true);
    setDisplayRecs(true);
    localStorage.setItem('displayRecs', true);

    // here's where we'll make the call to the backend using the fetch API
    // no changes to the existing code base will be necessary because we can take
    // the data received from the API and format it similar to the way the mock data is formatted,
    // then call `setThingsToDoRecs` and `setRestaurantRecs` as below using that data

    setThingsToDoRecs(mockThingsToDoData);
    setRestaurantRecs(mockRestaurantsData);

    localStorage.setItem('thingsToDoRecs', JSON.stringify(mockThingsToDoData));
    localStorage.setItem('restaurantRecs', JSON.stringify(mockRestaurantsData));

    setTimeout(() => setIsLoading(false), 1000);
  }

  const getMoreThingsToDoRecs = (e) => {
    e.preventDefault();
    const moreRecs = mockMoreThingsToDoData;
    const recs = [...thingsToDoRecs]
    let numRecs = recs.length
    for (let rec of moreRecs) {
      numRecs += 1;
      recs.push({
        key: numRecs,
        text: rec
      });
    };
    setThingsToDoRecs(recs);
    localStorage.setItem('thingsToDoRecs', JSON.stringify(recs));
  }


  const getMoreRestaurantRecs = (e) => {
    e.preventDefault();
    const moreRecs = mockMoreRestaurantsData;
    const recs = [...restaurantRecs]
    let numRecs = recs.length
    for (let rec of moreRecs) {
      numRecs += 1;
      recs.push({
        key: numRecs,
        text: rec
      });
    };
    setRestaurantRecs(recs);
    localStorage.setItem('restaurantRecs', JSON.stringify(recs));
  }
  
  const getVacationPlan = (e) => {
    // make call to backend 
    e.preventDefault();
    setIsLoading(true);
    const selectedThingsToDo = thingsToDoRecs.filter(item => item.checked === true).map(item => item.text);
    const selectedRestaurants = restaurantRecs.filter(item => item.checked === true).map(item => item.text);
    setTimeout(() => {
      setPlan(JSON.stringify(selectedThingsToDo) + JSON.stringify(selectedRestaurants));
      setIsLoading(false);
      navigate('/vacationPlanResults');
    }, 1500);
  }

  const startOver = (e) => {
    e.preventDefault();
    localStorage.clear();
    setDisplayRecs(false);
    setVacationLocation('');
    setNumTravellers('');
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
