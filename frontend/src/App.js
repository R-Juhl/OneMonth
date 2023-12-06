import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Assistant from './components/Assistant';

import Settings from './components/Settings';
import Profile from './components/Profile';

import GetStarted from './modules/GetStarted';

// Import avatars
import avatarDefault from './images/assistants/avatar_default.png';
import avatar1 from './images/assistants/avatar_1.png';

function App() {
  const [language, setLanguage] = useState('English');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentTab, setCurrentTab] = useState('');
  const [avatar, setAvatar] = useState(avatarDefault); // Initial avatar
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const permanentTabs = 
    ['Settings', 'Profile'];
  const conditionalTabs = 
    ['GetStarted'];

  const handleTabClick = (tabName) => {
    if (permanentTabs.includes(tabName)) {
      switch (tabName) {
        case 'Settings':
          setShowSettingsModal(true);
          setShowProfileModal(false);
          break;
        case 'Profile':
          setShowProfileModal(true);
          setShowSettingsModal(false);
          break;
        // Add more cases for other permanent tabs as needed
        default:
          // Handle default case if needed
          break;
      }
    } else if (conditionalTabs.includes(tabName)) {
      setCurrentTab(tabName);
      // Close all modals related to permanent tabs
      setShowSettingsModal(false);
      setShowProfileModal(false);
    }
  };

  // Define avatars
  const avatars = {
    avatar_d: avatarDefault,
    avatar_1: avatar1
  };

  return (
    <div>

      <Header />

      <div className="App">

        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} onTabClick={handleTabClick} />
        <div className={`Main-container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
          {currentTab === 'GetStarted' && <GetStarted />}
          {!currentTab && <Welcome />}
          {/* Add other conditional tab components here */}
        </div>

        <Assistant apiUrl="http://localhost:5000/assistant" avatar={avatar} />

        <Settings
          showSettingsModal={showSettingsModal}
          setShowSettingsModal={setShowSettingsModal}
          setAvatar={setAvatar}
          avatars={avatars}
          setLanguage={setLanguage}
          language={language}
        />
        <Profile
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
        />
      </div>
    </div>
  );
}

export default App;
