import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Assistant from './components/Assistant';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div>
      <Header />
      <div className="App">
        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
        <div className={`Main-container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <Welcome />
        {/* Rest of your App content */}
        </div>
        {/* Assistant component */}
        <Assistant apiUrl="http://localhost:5000/assistant" />
      </div>
    </div>
  );
}

export default App;
