import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage () {
  return (
    <div>
      <h1>Welcome to Plan Your Vacation!</h1>
      <p>
        For information about how to use this application, click <Link to="/about">here</Link>!
      </p>
      <p>
        Otherwise, to continue and start planning your vacation, click <Link to="/planVacation">here</Link>!
      </p>
    </div>
  );
}
