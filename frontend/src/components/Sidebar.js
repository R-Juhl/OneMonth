// Sidebar.js
import React from 'react';
import './Sidebar.css';
import Tabs from './Tabs';

function Sidebar({ isExpanded, setIsExpanded, onTabClick, conditionalTabs }) {
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isExpanded ? '<' : '>'}
      </button>
      <Tabs 
        isSidebarExpanded={isExpanded} 
        onTabClick={onTabClick} 
        conditionalTabs={conditionalTabs} 
      />
    </div>
  );
}

export default Sidebar;
