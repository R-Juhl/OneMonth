// Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar({ isExpanded, setIsExpanded }) {
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded); // Toggle the state
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isExpanded ? '<' : '>'} {/* Change icon based on state */}
      </button>
      {/* Sidebar content goes here */}
    </div>
  );
}

export default Sidebar;
