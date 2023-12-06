// Sidebar.js
import React from 'react';
import './Sidebar.css';
import Tabs from './Tabs';

function Sidebar({ isExpanded, setIsExpanded, onTabClick }) {
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isExpanded ? '<' : '>'}
      </button>
      <Tabs isSidebarExpanded={isExpanded} onTabClick={onTabClick} />
    </div>
  );
}

export default Sidebar;
