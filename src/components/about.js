import React from 'react';
import { Link } from 'react-router-dom';


export default function About () {
  return (
    <div>
      <h1>About Plan Your Vacation</h1>
      <p>Plan Your Vacation is an <strong>AI Assisted</strong> tool where you can plan your dream vacation! All you have to do is tell us where you're going and how many people you're travelling with! Then choose from a list of things to do and places to eat and we will craft a plan tailored to you!</p>
      <p>To get started, click <Link to="/planVacation">here</Link>!</p>
    </div>
  );
}
