import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './tooltipStyle';

export default function About () {
  const tooltipText = 'We use OpenAI to power our application.'
  return (
    <div>
      <h1>About Plan Your Vacation</h1>
      <p>Plan Your Vacation is an <strong>AI Assisted</strong><AiFillInfoCircle id='ai-tooltip' data-tooltip-content={tooltipText} /> tool where you can plan your dream vacation!</p> 
      <p>All you have to do is tell us where you're going and how many people you're travelling with!</p> 
      <p>Then choose from a list of things to do and places to eat and we will craft a plan tailored to you!</p>
      <p>To get started, click <Link to="/planVacation">here</Link>!</p>
      <Tooltip 
      style={tooltipStyle}
      anchorId='ai-tooltip' 
      place='right' 
      delayShow='300'
      delayHide='100'
      />
    </div>
  );
}
