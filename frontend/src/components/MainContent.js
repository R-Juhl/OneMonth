//MainContent.js
import React, { useState, useContext, useCallback } from 'react';
import UserIdContext from '../contexts/UserIdContext';
import GetStarted from '../modules/GetStarted';
import Curriculum from '../modules/Curriculum';
import VariableContent from '../modules/VariableContent';
import SelectCourses from '../modules/SelectCourses';

import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

import Welcome from './Welcome';
import Sidebar from './Sidebar';
import Howitworks from './Howitworks';
import Profile from './Profile';
import Settings from './Settings';

const MainContent = ({ isSidebarExpanded, setIsSidebarExpanded, avatars, setAvatar, currentView, setCurrentView }) => {
    const { userVersion, isLoggedIn, loggedInUserId, handleUserVersionSelect } = useContext(UserIdContext);
    const { language } = useLanguage();
    const text = language === 'en' ? en : dk;
    const [currentTab, setCurrentTab] = React.useState('');
    const [selectedCourseId, setSelectedCourseId] = React.useState(null);
    const [showStartModal, setShowStartModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showHowitworksModal, setShowHowitworksModal] = useState(false);
    const [CourseTitle, setCurrentCourseTitle] = useState("");

    const permanentTabs = 
        ['Howitworks', 'Profile', 'Settings'];
    const conditionalTabs = isLoggedIn && userVersion 
    ? [
        { name: text.tabsCurriculumTitle, component: "Curriculum", priority: 1 }, // Show Curriculum tab if userVersion exists
        { name: text.tabsSelectcoursesTitle, component: "SelectCourses", priority: 2 } // Show Select Courses tab if userVersion exists
        ]
    : [{ name: text.tabsGetstartedTitle, component: "GetStarted", priority: 1 }]; // Show GetStarted tab if no userVersion

    const handleTabClick = (tabName) => {
        setShowHowitworksModal(false);
        setShowProfileModal(false);
        setShowSettingsModal(false);
        setShowStartModal(false);
        setCurrentTab(tabName);
    
        switch (tabName) {
            case 'Curriculum':
                setCurrentView('Curriculum');
                break;
            case 'SelectCourses':
                setCurrentView('SelectCourses');
                break;
            case 'GetStarted':
                setShowStartModal(true);
                break;
            case 'Howitworks':
                setShowHowitworksModal(true);
                break;
            case 'Profile':
                setShowProfileModal(true);
                break;
            case 'Settings':
                setShowSettingsModal(true);
                break;
            // Add more cases for other tabs as needed
            default:
                break;
        }
    };

    const handleCourseSessionStart = useCallback((courseId, courseTitle, loggedInUserId) => {
        console.log("handleCourseSessionStart called with courseId:", courseId, "courseTitle:", courseTitle, "userId:", loggedInUserId);
        setSelectedCourseId(courseId);
        setCurrentCourseTitle(courseTitle);
        setCurrentView('VariableContent');
    }, []);

    const handleLeaveClass = useCallback(() => {
        setCurrentView('Curriculum');
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

            {showStartModal && !userVersion && (
                <GetStarted
                    showStartModal={showStartModal}
                    setShowStartModal={setShowStartModal}
                    onUserVersionSelect={handleUserVersionSelect}
                />
            )}


            {isLoggedIn && userVersion && currentView === 'Curriculum' && (
                <Curriculum 
                    onStartCourse={handleCourseSessionStart} 
                />
            )}
            {isLoggedIn && userVersion && currentView === 'SelectCourses' &&
                <SelectCourses />}
            {isLoggedIn && userVersion && currentView === 'VariableContent' && (
                <VariableContent
                    courseId={selectedCourseId}
                    courseTitle={CourseTitle}
                    onLeaveClass={handleLeaveClass}
                />
            )}


            {showHowitworksModal && <Howitworks 
                showHowitworksModal={showHowitworksModal}
                setShowHowitworksModal={setShowHowitworksModal} 
            />}
            {showProfileModal && <Profile 
                showProfileModal={showProfileModal}
                setShowProfileModal={setShowProfileModal} 
            />}
            {showSettingsModal && <Settings 
                showSettingsModal={showSettingsModal}
                setShowSettingsModal={setShowSettingsModal} 
                setAvatar={setAvatar} 
                avatars={avatars} 
            />}

        </div>
    );
};

export default MainContent;
