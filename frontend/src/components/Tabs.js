// Tabs.js
import React from 'react';
import './Tabs.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

import { HiOutlineFire, HiOutlineDocumentText, HiOutlineUser, HiOutlineCog, HiOutlineBookOpen, HiOutlineCalendar  } from "react-icons/hi";

function Tabs({ onTabClick, conditionalTabs }) {
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;

  // Function to select the appropriate icon based on the tab name
  const selectIcon = (tabName) => {
    switch(tabName) {
      case 'GetStarted':
        return <HiOutlineFire />;
      case 'Howitworks':
        return <HiOutlineDocumentText />;
      case 'Profile':
        return <HiOutlineUser />;
      case 'Settings':
        return <HiOutlineCog />;
      case 'Curriculum':
        return <HiOutlineBookOpen />;
      case 'SelectCourses':
        return <HiOutlineCalendar />;
      default:
        return null;
    }
  };

  return (
    <div className="tabs-container">
      {/* Render Conditional Tabs based on conditionalTabs prop */}
      {conditionalTabs && conditionalTabs
        .sort((a, b) => a.priority - b.priority) // Sort based on priority
        .map((tab, index) => (
          <button key={index} className="tab-button" onClick={() => onTabClick(tab.component)}>
            {selectIcon(tab.component)}
            <span className="tooltip-text">{tab.name}</span>
          </button>
        ))
      }

      {/* Spacer */}
      <div className="spacer"></div>

      {/* Permanent Tabs */}
      <button className="tab-button" onClick={() => onTabClick('Howitworks')}>
        <HiOutlineDocumentText />
        <span className="tooltip-text">{text.tabsHowitworksTitle}</span>
      </button>
      <button className="tab-button" onClick={() => onTabClick('Profile')}>
        <HiOutlineUser />
        <span className="tooltip-text">{text.tabsProfileTitle}</span>
      </button>
      <button className="tab-button" onClick={() => onTabClick('Settings')}>
        <HiOutlineCog />
        <span className="tooltip-text">{text.tabsSettingsTitle}</span>
      </button>
    </div>
  );
}

export default Tabs;