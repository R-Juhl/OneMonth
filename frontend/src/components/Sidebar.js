// Sidebar.js
import React from 'react';
import './Sidebar.css';
import Tabs from './Tabs';

function Sidebar({ onTabClick, conditionalTabs }) {
  
  return (
    <div className="sidebar">
      <Tabs 
        onTabClick={onTabClick} 
        conditionalTabs={conditionalTabs} 
      />
    </div>
  );
}

export default Sidebar;
