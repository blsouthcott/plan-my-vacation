import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ plans }) {
  const location = useLocation();
  const [burgerIsActive, setBurgerIsActive] = useState(false);

  const toggleBurger = () => {
    setBurgerIsActive(!burgerIsActive);
  };

  useEffect(() => {
    setBurgerIsActive(false);
  }, [location])

  return (
    <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <FontAwesomeIcon icon={faUmbrellaBeach} />        
        </Link>

        <button
          className={`navbar-burger burger ${burgerIsActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar"
          onClick={toggleBurger}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </button>
      </div>

      <div
        id="navbar"
        className={`navbar-menu ${burgerIsActive ? 'is-active' : ''}`}>
          <div className="navbar-start">
            <Link className="navbar-item" to="/">
              Home
            </Link>

            <Link className="navbar-item" to="/about">
              About
            </Link>

            <Link className="navbar-item" to="/plan-vacation">
              Plan Vacation
            </Link>

            {plans.length > 0 &&
              <Link className="navbar-item" to="/vacation-plan-results">
                View Current Plans
              </Link>}
          </div>
      </div>
    </nav>
  );
}
