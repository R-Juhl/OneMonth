import React from 'react';
import './Tabs.css';

function Tabs({ isSidebarExpanded, onTabClick }) {

  const conditionalTabs = [
    { name: 'Get Started', component: 'GetStartedComponent', priority: 1 },
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

      {/* Spacer */}
      <div className="spacer"></div>

      {/* Permanent Tabs */}
      <button className="tab-button" onClick={() => onTabClick('Profile')}>
        <span className="tab-button-text">Profile</span>
      </button>
      <button className="tab-button" onClick={() => onTabClick('Settings')}>
        <span className="tab-button-text">Settings</span>
      </button>
    </div>
  );
}

export default Tabs;