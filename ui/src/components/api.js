import { sanitizeRecText } from "./utils";

const recsToObjs = (recs, numExistingRecs=0) => (
  recs.map((rec, i) => ({
    key: numExistingRecs+i,
    text: sanitizeRecText(rec),
    checked: false
  }))
)

const fetchRecs = async (body) => {
  const resp = await fetch("/api/recommendations", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    }
  });
  if (resp.status === 200) {
    const data = await resp.json();
    return data.recs;
  } else if (resp.status === 429) {
    const data = await resp.json();
    window.alert("You have exceeded your current request limit: " + data.message)
  } else {
    window.alert("Unable to load recommendations");
  };
  return [];
}

export const loadRecs = async (form, setForm, setIsLoading, recsNames) => {
  if (!form.vacationLocation || form.numDays < 1) {
    window.alert("Please provide a vacation location and number of travel days greater than 1 before requesting recommendations");
    return;
  };
  setIsLoading(true);
  const recsArr = await Promise.all(
    recsNames.map(recName => (
      fetchRecs({
        location: form.vacationLocation,
        rec_type: recName === "thingsToDoRecs" ? "thingsToDo" : "restaurants",
        exclusions: form[recName].map(rec => rec.text)
      })
    ))
  );
  const updatedRecs = recsNames.map((recsName, idx) => {
    const currRecs = [...form[recsName]];
    const recs = recsToObjs(recsArr[idx], currRecs.length);
    return [...currRecs, ...recs];
  });
  const recsObj = Object.fromEntries(recsNames.map((recName, idx) => [recName, updatedRecs[idx]]));
  const updatedForm = {
    ...form,
    ...recsObj,
    displayRecs: true,
  }
  setForm({
    ...updatedForm,
  });
  localStorage.setItem("form", JSON.stringify({
    ...updatedForm,
  }))
  setIsLoading(false);    
}

const handlePlansChange = (form, newPlan, plans, setPlans) => {
  const currPlans = [...plans];
  currPlans.push({
    key: currPlans.length+1,
    text: newPlan, 
    location: form.vacationLocation
  });
  setPlans(currPlans);
  localStorage.setItem("plans", JSON.stringify(currPlans));
}

export const loadItinerary = async (form, plans, setPlans, navigate, setIsLoading) => {
  setIsLoading(true);
  const resp = await fetch("/api/itinerary", {
    method: "POST",
    body: JSON.stringify({
      things_to_do: form.thingsToDoRecs.filter(item => item.checked === true).map(item => item.text),
      restaurants: form.restaurantRecs.filter(item => item.checked === true).map(item => item.text),
      num_days: form.numDays
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  if (resp.status === 200) {
    const data = await resp.json();
    const newPlan = data.itinerary;
    handlePlansChange(form, newPlan, plans, setPlans);
    navigate("/vacation-plan-results", {state: {planTabIndex: plans.length}});
  } else if (resp.status === 429) {
    const data = await resp.json();
    window.alert("You have exceeded your current request limit: " + data.message)
  } else {
    const text = await resp.text();
    window.alert(text);
  };
}
