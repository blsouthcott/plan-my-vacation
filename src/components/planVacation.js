import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';


const mockThingsToDoData = [
  {
    key: 1, 
    text: 'Walk around Central Park',
  },
  {
    key: 2,
    text: 'Go to the Empire State Building',
  },
  {
    key: 3,
    text: 'Go to Smalls Jazz Clud'
  }
]

const mockRestaurantsData = [
  {
    key: 1,
    text: 'Katz\'s Delicatessen',
  },
  {
    key: 2,
    text: 'Keens Steakhouse',
  },
  {
    key: 3,
    text: 'The Russian Tea Room',
  }
]


export default function VacationForm ({ setPlan }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [vacationLocation, setVacationLocation] = useState('');
  const [numTravellers, setNumTravellers] = useState('');
  const [thingsToDoRecs, setThingsToDoRecs] = useState([]);
  const [userSelectedThingsToDo, setUserSelectedThingsToDo] = useState([]);
  const [restaurantRecs, setRestaurantRecs] = useState([]);
  const [userSelectedRestaurants, setUserSelectedRestaurants] = useState([]);

  const [displayRecs, setDisplayRecs] = useState(false);

  const handleNumTravellersChange = (e) => {
    e.target.value >= 1 && setNumTravellers(e.target.value);
  }

  const handleThingToDoCheckBoxChange = (e) => {
    let checked;
    if (e.target.checked) {
      checked = [...userSelectedThingsToDo];
      const thingToDo = thingsToDoRecs.filter(item => item.key === e.target.value);
      checked.push(thingToDo[0]);
    } else {
      checked = userSelectedRestaurants.filter(item => item.key !== e.target.value);
    }
    setUserSelectedThingsToDo(checked);
  }

  const handleRestaurantRecCheckboxChange = (e) => {
    let checked;
    if (e.target.checked) {
      checked = [...userSelectedRestaurants];
      const restaurant = restaurantRecs.filter(item => item.key === e.target.value);
      checked.push(restaurant[0]);
    } else {
      checked = userSelectedRestaurants.filter(item => item.key !== e.target.value);
    }
    setUserSelectedRestaurants(checked);
  }

  const getRecs = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDisplayRecs(true);
    // make call to backend here using vacationLocation and numTravellers
    // await fetch() etc.
    setThingsToDoRecs(mockThingsToDoData);
    setRestaurantRecs(mockRestaurantsData);
    setTimeout(() => setIsLoading(false), 1500);
  }


  const getVacationPlan = (e) => {
    // make call to backend 
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setPlan('Here is your vacation plan!');
      setIsLoading(false);
      navigate('/vacationPlanResults');
    }, 1500);
  }


  return (
    <>
      <h2>Let's Plan Your Vacation!</h2>
      {isLoading ? <ClipLoader /> :
      <div id='recs-form'>
        <form onSubmit={getRecs}>

          <label>
            Where are you going?
            <br />
            <input 
            type='text'
            placeholder='Enter location...'
            value={vacationLocation}
            onChange={e => setVacationLocation(e.target.value)} 
            />
          </label>

          <br />
          <br />

          <label>
            How many people are you travelling with?
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

          <button type='submit'>
            Get Recommendations!
          </button>

          <br />
          <br />

        </form>

        {displayRecs &&
        <form onSubmit={getVacationPlan}>

          <div id='things-to-do-recs'>
            <h3>Things To Do</h3>
            {thingsToDoRecs.map((thing, i) => {
              return (
                <>
                  <label>
                    <input 
                    type='checkbox' 
                    value={thing.key} 
                    onChange={e => handleThingToDoCheckBoxChange(e)}
                    key={i}
                    />
                    {thing.text}
                  </label>
                  <br />
                </>
            )})}
          </div>

          <br />

          <div id='things-to-do-recs'>
            <h3>Restaurants</h3>
            {restaurantRecs.map((restaurant, i) => {
              return (
                <>
                  <label>
                    <input 
                    type='checkbox' 
                    value={restaurant.key} 
                    onChange={e => handleRestaurantRecCheckboxChange(e)}
                    key={i}
                    />
                    {restaurant.text}
                  </label>
                  <br />
                </>
            )})}
          </div>

          <br />
          <label>
            Get Vacation Plan!
            <br />
            <input type="submit"/>
          </label>

        </form>
        }
      </div>
      }
    </>
  );
}
