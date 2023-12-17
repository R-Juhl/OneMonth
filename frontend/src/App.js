//App.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageManager from './contexts/LanguageManager';
import avatars from './imports/avatars';
import { UserIdProvider } from './contexts/UserIdContext';

// Import components
import MainContent from './components/MainContent';
import Header from './components/Header';
import Assistant from './components/Assistant';

Modal.setAppElement('#root');

function App() {
  const [avatar, setAvatar] = React.useState(avatars.avatar_d);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);


  return (
    <UserIdProvider>
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
