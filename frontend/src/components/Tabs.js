// Tabs.js
import React from 'react';
import './Tabs.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

function Tabs({ isSidebarExpanded, onTabClick }) {
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;

  const conditionalTabs = [
    { name: text.tabsGetstartedTitle, component: 'GetStarted', priority: 1 },
    // Add more tabs as needed
  ];

  // Sort tabs based on priority
  const sortedTabs = conditionalTabs.sort((a, b) => a.priority - b.priority);

  return (
    <div className={`tabs-container ${isSidebarExpanded ? '' : 'collapsed'}`}>
      {/* Render Conditional Tabs */}
      {sortedTabs.map((tab, index) => (
        <button key={index} className="tab-button" onClick={() => onTabClick(tab.component)}>
          <span className="tab-button-text">{tab.name}</span>
        </button>
      ))}

      {/* Afsætning Tab */}
      <button className="tab-button" onClick={() => onTabClick('Afsætning')}>
        <span className="tab-button-text">Afsætning</span>
      </button>

      {/* Spacer */}
      <div className="spacer"></div>

      {/* Permanent Tabs */}
      <button className="tab-button" onClick={() => onTabClick('Profile')}>
        <span className="tab-button-text">{text.tabsProfileTitle}</span>
      </button>
      <button className="tab-button" onClick={() => onTabClick('Settings')}>
        <span className="tab-button-text">{text.tabsSettingsTitle}</span>
      </button>
    </div>
  );
}

export default Tabs;