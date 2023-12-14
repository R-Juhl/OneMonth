//App.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import './App.css';
import avatars from './imports/avatars';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Assistant from './components/Assistant';
import VariableContent from './components/VariableContent';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageManager from './contexts/LanguageManager';

// Import permanent tabs
import Settings from './components/Settings';
import Profile from './components/Profile';

// Import conditional tabs
import GetStarted from './modules/GetStarted';

Modal.setAppElement('#root');

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentTab, setCurrentTab] = useState('');
  const [avatar, setAvatar] = useState(avatars.avatar_d);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const [isAfsaetningReady, setIsAfsaetningReady] = useState(false);

  const permanentTabs = 
    ['Settings', 'Profile'];
  const conditionalTabs = 
    ['GetStarted'];

  const updateLoginStatus = (status, userId) => {
    setIsLoggedIn(status);
    setLoggedInUserId(userId);
  };

  const handleTabClick = (tabName) => {
    console.log('handleTabClick called with:', tabName);
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
      if (tabName === 'GetStarted') {
        setShowStartModal(true); // Open the GetStarted modal
      }
    }
    if (tabName === 'Afsætning') {
      setShowSettingsModal(false);
      setShowProfileModal(false);
      setCurrentTab(tabName);
      setIsAfsaetningReady(true);  // Set this to trigger fetching the initial message
    } else {
      setIsAfsaetningReady(false); // Reset this if another tab is clicked
    }
  }
 

  return (
    <LanguageProvider>
      <LanguageManager isLoggedIn={isLoggedIn} loggedInUserId={loggedInUserId}>
        <div>

          <Header updateLoginStatus={updateLoginStatus} />

          <div className="App">

            <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} onTabClick={handleTabClick} />

            <div className={`Main-container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
              {/* Always show Welcome component, but conditionally show GetStarted */}
              {currentTab !== 'Afsætning' && <Welcome />}
              {currentTab === 'GetStarted' && <GetStarted
                showStartModal={showStartModal}
                setShowStartModal={setShowStartModal}
              />}
              {currentTab === 'Afsætning' && <VariableContent 
                isAfsaetningReady={isAfsaetningReady}
                loggedInUserId={loggedInUserId}
              />}
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
      </LanguageManager>
    </LanguageProvider>
  );
}

export default App;
