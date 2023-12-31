//App.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageManager from './contexts/LanguageManager';
import { UserIdProvider } from './contexts/UserIdContext';
import avatars from './imports/avatars';

// Import components
import MainContent from './components/MainContent';
import Header from './components/Header';
import Assistant from './components/Assistant';

Modal.setAppElement('#root');

function App() {
  const [avatar, setAvatar] = React.useState(avatars.avatar_d);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentView, setCurrentView] = useState('Curriculum');

  return (
    <UserIdProvider setCurrentView={setCurrentView}>
      <LanguageProvider>
        <LanguageManager>
          <div>
            <Header />

            <div className="App">

              <MainContent
                isSidebarExpanded={isSidebarExpanded}
                setIsSidebarExpanded={setIsSidebarExpanded}
                setAvatar={setAvatar}
                avatars={avatars}
                currentView={currentView}
                setCurrentView={setCurrentView}
              />

              <Assistant
                apiUrl="http://localhost:5000/assistant"
                avatar={avatar}
              />

            </div>
          </div>
        </LanguageManager>
      </LanguageProvider>
    </UserIdProvider>
  );
}

export default App;
