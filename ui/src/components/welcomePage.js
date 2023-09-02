import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './footer';

export default function WelcomePage () {
  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="is-flex is-justify-content-center">
            <h1 className="title">Welcome to Plan Your Vacation!</h1>
          </div>
          <div className="is-flex is-justify-content-center my-3">
            <div className="card">
              <div className="card-content">
                <div className="content">
                  <p>
                    For information about how to use this application, click <Link className="has-text-link" to="/about">here</Link>!
                  </p>
                  <p>
                    Otherwise, to continue and start planning your vacation, click <Link className="has-text-link" to="/planVacation">here</Link>!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
