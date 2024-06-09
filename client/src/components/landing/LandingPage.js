// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <div className="landing-page-logo-container">
          <img src="/images/logo.png"className="landing-page-logo" />
          <div className="landing-page-logo-text">SoileSay</div>
        </div>
        <div className="landing-page-language-and-auth">
          <select className="landing-page-language-select">
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>
          <Link to="/signup" className="landing-page-btn landing-page-btn-primary">Sign up</Link>
          <Link to="/signin" className="landing-page-btn landing-page-btn-secondary">Log in</Link>
        </div>
      </header>
      <main className="landing-page-main-content">
        <div className="landing-page-text-content">
          <h1 className="landing-page-heading">Make learning fun with SoileSay!</h1>
          <p className="landing-page-description">PRACTICE KAZAKH LANGUAGE SKILLS THROUGH FUN AND INTERACTIVE GAMES!</p>
          <Link to="/signup" className="landing-page-main-signup-btn">Sign up for free</Link>
        </div>
        <div className="landing-page-image-content">
          <img src="/images/left_pic.png"/>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
