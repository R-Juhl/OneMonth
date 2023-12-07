// Welcome.js
import React from 'react';
import parse from 'html-react-parser';
import './Welcome.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

function Welcome() {
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">{text.welcomeTitle}</h1>
      <div className="welcome-section">
        <p>{parse(text.welcomeDescription1)}</p>
      </div>
      <div className="welcome-section">
        <p>{parse(text.welcomeDescription2)}</p>
      </div>
      <div className="welcome-section">
        <p>{parse(text.welcomeDescription3)}</p>
      </div>
      <div className="welcome-section">
        <p>{parse(text.welcomeDescription4)}</p>
      </div>
      <div className="welcome-section">
        <p>{parse(text.welcomeDescription5)}</p>
      </div>
      <div className="welcome-section final-section">
        <p>{parse(text.welcomeDescription6)}</p>
      </div>
    </div>
  );
}

export default Welcome;