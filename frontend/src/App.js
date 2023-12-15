//App.js
import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageManager from './contexts/LanguageManager';
import avatars from './imports/avatars';

// Import components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Assistant from './components/Assistant';
//import VariableContent from './components/VariableContent';

// Import permanent tabs
import Howitworks from './components/Howitworks';
import Profile from './components/Profile';
import Settings from './components/Settings';

// Import conditional tabs
import GetStarted from './modules/GetStarted';
import Curriculum from './modules/Curriculum';

Modal.setAppElement('#root');

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentTab, setCurrentTab] = useState('');
  const [avatar, setAvatar] = useState(avatars.avatar_d);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showHowitworksModal, setShowHowitworksModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [userVersion, setUserVersion] = useState(null);
  const [currentUser, setCurrentUser] = useState('Not logged in')

  const permanentTabs = 
    ['Howitworks', 'Profile', 'Settings'];
  const conditionalTabs = isLoggedIn && userVersion 
    ? [{ name: "Curriculum", component: "Curriculum", priority: 1 }] // Show Curriculum tab if userVersion exists
    : [{ name: "Get Started", component: "GetStarted", priority: 2 }]; // Show GetStarted tab if no userVersion

  const updateLoginStatus = (status, userId) => {
    setIsLoggedIn(status);
    setLoggedInUserId(userId);
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        await verifyToken(); // Call verifyToken to update the app state
      } else {
        // Handle login error
        console.error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle server error
    }
  };

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:5000/verify_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await response.json();
        if (response.ok) {
          setIsLoggedIn(true);
          setLoggedInUserId(data.user_id);
          setUserVersion(data.user_version);
          setCurrentUser(data.user);
        } else {
          // Handle token verification failure
        }
      } catch (error) {
        // handle error
      }
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setLoggedInUserId(null);
    setUserVersion(null);
    setCurrentUser('Not logged in');
  }, []);

  const handleUserVersionSelect = async (version) => {
    // Update user version in backend
    const response = await fetch('http://localhost:5000/update_user_version', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ user_id: loggedInUserId, user_version: version })
    });
    const data = await response.json();
    if (data.message) {
      setUserVersion(version);
    } else {
      alert(data.error); // Replace with better error handling
    }
  };

  const onUserVersionSelected = useCallback(() => {
    setShowStartModal(false);
  }, []);

  const handleTabClick = (tabName) => {
    if (permanentTabs.includes(tabName)) {
      switch (tabName) {
        case 'Howitworks':
          setShowHowitworksModal(true);
          setShowProfileModal(false);
          setShowSettingsModal(false);
          break;
        case 'Profile':
          setShowProfileModal(true);
          setShowHowitworksModal(false);
          setShowSettingsModal(false);
          break;
        case 'Settings':
          setShowSettingsModal(true);
          setShowHowitworksModal(false);
          setShowProfileModal(false);
          break;
        // Add more cases for other permanent tabs as needed
        default:
          // Handle default case if needed
          break;
      }
    } else {
      // Find if tabName matches any component name in conditionalTabs
      const tabExists = conditionalTabs.some(tab => tab.component === tabName || tab.name === tabName);
      if (tabExists) {
        setCurrentTab(tabName);
        setShowHowitworksModal(false);
        setShowProfileModal(false);
        setShowSettingsModal(false);
        setShowStartModal(tabName === 'GetStarted');
      }
    }
  };

  return (
    <LanguageProvider>
      <LanguageManager isLoggedIn={isLoggedIn} loggedInUserId={loggedInUserId}>
        <div>

          <Header
            handleLogin={handleLogin}
            updateLoginStatus={updateLoginStatus}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            handleLogout={handleLogout}
            isLoggedIn={isLoggedIn}
          />

          <div className="App">

            <Sidebar
              isExpanded={isSidebarExpanded}
              setIsExpanded={setIsSidebarExpanded}
              onTabClick={handleTabClick}
              conditionalTabs={conditionalTabs} // Pass conditionalTabs to Tabs
            />

            <div className={`Main-container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
              {currentTab === '' && userVersion && <Curriculum />}
              {!userVersion && <Welcome />}

              {currentTab === 'GetStarted' && !userVersion && (
                <GetStarted
                  showStartModal={showStartModal}
                  setShowStartModal={setShowStartModal}
                  isLoggedIn={isLoggedIn}
                  onUserVersionSelect={handleUserVersionSelect}
                  onSuccessfulSelection={onUserVersionSelected} // Pass the callback function to GetStarted
                />
              )}

              {currentTab === 'Curriculum' && userVersion && (
                <Curriculum
                  // Pass any props needed by Curriculum component
                />
              )}

              {/* Add other conditional tab components here */}
              
            </div>

            <Assistant
              apiUrl="http://localhost:5000/assistant"
              avatar={avatar}
            />

            <Howitworks
              showHowitworksModal={showHowitworksModal}
              setShowHowitworksModal={setShowHowitworksModal}
            />

            <Profile
              showProfileModal={showProfileModal}
              setShowProfileModal={setShowProfileModal}
            />

            <Settings
              showSettingsModal={showSettingsModal}
              setShowSettingsModal={setShowSettingsModal}
              setAvatar={setAvatar}
              avatars={avatars}
              isLoggedIn={isLoggedIn}
              loggedInUserId={loggedInUserId}
            />

          </div>
        </div>
      </LanguageManager>
    </LanguageProvider>
  );
}

export default App;
