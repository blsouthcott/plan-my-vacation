import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillInfoCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import { tooltipStyle } from './tooltipStyle';
import Footer from './footer';

export default function About () {
  const tooltipText = 'We use OpenAI to power our application.'
  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">About Plan Your Vacation</h1>
          <div className="card">
            <div className="card-content">
              <div className="content">
                <p>Plan Your Vacation is an <strong>AI Assisted</strong><AiFillInfoCircle id='ai-tooltip' data-tooltip-content={tooltipText} /> tool where you can plan your dream vacation!</p> 
                <p>All you have to do is tell us where you're going and how many days you'll be travelling!</p> 
                <p>Based on the information you provide, we'll give you recommendations of things to do and places to eat -- then craft a vacation plan tailored to you based on your choices!</p>
                <p>To get started, click <Link className="has-text-link" to="/plan-vacation">here</Link>!</p>
                <Tooltip 
                style={tooltipStyle}
                anchorId='ai-tooltip' 
                place='right' 
                delayShow='300'
                delayHide='100'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
