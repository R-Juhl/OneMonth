// Tabs.js
import React from 'react';
import './Tabs.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

function Tabs({ isSidebarExpanded, onTabClick, conditionalTabs }) {
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;

  return (
    <div className={`tabs-container ${isSidebarExpanded ? '' : 'collapsed'}`}>
      {/* Render Conditional Tabs based on conditionalTabs prop */}
      {conditionalTabs && conditionalTabs
        .sort((a, b) => a.priority - b.priority) // Sort based on priority
        .map((tab, index) => (
          <button key={index} className="tab-button" onClick={() => onTabClick(tab.component)}>
            <span className="tab-button-text">{tab.name}</span>
          </button>
        ))
      }

      {/* Spacer */}
      <div className="spacer"></div>

      {/* Permanent Tabs */}
      <button className="tab-button" onClick={() => onTabClick('Howitworks')}>
        <span className="tab-button-text">{text.tabsHowitworksTitle}</span>
      </button>
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