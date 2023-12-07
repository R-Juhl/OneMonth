//App.js
import React, { useState } from 'react';
import './App.css';
import avatars from './imports/avatars';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Assistant from './components/Assistant';
import { LanguageProvider } from './contexts/LanguageContext';

// Import permanent tabs
import Settings from './components/Settings';
import Profile from './components/Profile';

// Import conditional tabs
import GetStarted from './modules/GetStarted';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentTab, setCurrentTab] = useState('');
  const [avatar, setAvatar] = useState(avatars.avatar_d);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const permanentTabs = 
    ['Settings', 'Profile'];
  const conditionalTabs = 
    ['GetStarted'];

  const updateLoginStatus = (status, userId) => {
    setIsLoggedIn(status);
    setLoggedInUserId(userId);
  };

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

  return (
    <LanguageProvider>
      <div>

        <Header updateLoginStatus={updateLoginStatus} />

        <div className="App">

          <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} onTabClick={handleTabClick} />
          <div className={`Main-container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
            {currentTab === 'GetStarted' && <GetStarted />}
            {!currentTab && <Welcome />}
            {/* Add other conditional tab components here */}
          </div>

          <Assistant
            apiUrl="http://localhost:5000/assistant"
            avatar={avatar}
          />

          <Settings
            showSettingsModal={showSettingsModal}
            setShowSettingsModal={setShowSettingsModal}
            setAvatar={setAvatar}
            avatars={avatars}
            isLoggedIn={isLoggedIn}
            loggedInUserId={loggedInUserId}
          />
          <Profile
            showProfileModal={showProfileModal}
            setShowProfileModal={setShowProfileModal}
          />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
