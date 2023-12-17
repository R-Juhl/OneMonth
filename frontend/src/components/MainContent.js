//MainContent.js
import React, { useState, useContext, useCallback } from 'react';
import UserIdContext from '../contexts/UserIdContext';
import GetStarted from '../modules/GetStarted';
import Curriculum from '../modules/Curriculum';
import VariableContent from '../modules/VariableContent';
import Welcome from './Welcome';
import Sidebar from './Sidebar';

import Howitworks from './Howitworks';
import Profile from './Profile';
import Settings from './Settings';

const MainContent = ({ isSidebarExpanded, setIsSidebarExpanded, avatars, setAvatar }) => {
    const { userVersion, isLoggedIn, loggedInUserId, handleUserVersionSelect } = useContext(UserIdContext);
    const [currentTab, setCurrentTab] = React.useState('');
    const [selectedCourseId, setSelectedCourseId] = React.useState(null);
    const [currentView, setCurrentView] = React.useState('Curriculum');
    const [showStartModal, setShowStartModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showHowitworksModal, setShowHowitworksModal] = useState(false);
    const [CourseTitle, setCurrentCourseTitle] = useState("");

    const permanentTabs = 
        ['Howitworks', 'Profile', 'Settings'];
    const conditionalTabs = isLoggedIn && userVersion 
        ? [{ name: "Curriculum", component: "Curriculum", priority: 1 }] // Show Curriculum tab if userVersion exists
        : [{ name: "Get Started", component: "GetStarted", priority: 2 }]; // Show GetStarted tab if no userVersion

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

    const handleCourseSessionStart = useCallback((courseId, courseTitle, loggedInUserId) => {
        console.log("handleCourseSessionStart called with courseId:", courseId, "courseTitle:", courseTitle, "userId:", loggedInUserId);
        setSelectedCourseId(courseId);
        setCurrentCourseTitle(courseTitle);
        setCurrentView('VariableContent');
    }, []);

    return (
        <div className={`Main-container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>

            <Sidebar
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
                onTabClick={handleTabClick}
                conditionalTabs={conditionalTabs}
            />

            {!userVersion && <Welcome />}

            {currentTab === 'GetStarted' && !userVersion && (
                <GetStarted
                    showStartModal={showStartModal}
                    setShowStartModal={setShowStartModal}
                    onUserVersionSelect={handleUserVersionSelect}
                />
            )}

            {currentTab === '' && currentView === 'Curriculum' && userVersion && (
                <Curriculum
                    onStartCourse={handleCourseSessionStart}
                />
            )}

            {currentView === 'VariableContent' && (
                <VariableContent
                    courseId={selectedCourseId}
                    courseTitle={CourseTitle}
                />
            )}

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
    );
};

export default MainContent;
