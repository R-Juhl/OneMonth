// Curriculum.js
import React, { useContext, useEffect, useState } from 'react';
import './Curriculum.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';
import CourseBox from './CourseBox';
import CoursesData from './CoursesData';
import UserIdContext from '../contexts/UserIdContext';

const Curriculum = ({ course, onStartCourse }) => {
    const { loggedInUserId } = useContext(UserIdContext);
    const { language } = useLanguage();
    const text = language === 'en' ? en : dk;
    const translations = language === 'en' ? en : dk;
    const [userCourseSessions, setUserCourseSessions] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        const fetchUserCourseSessions = async () => {
            const response = await fetch('http://localhost:5000/get_user_course_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: loggedInUserId })
            });
            if (response.ok) {
                const data = await response.json();
                setUserCourseSessions(data);
            }
        };

        if (loggedInUserId) {
            fetchUserCourseSessions();
        }

        // Fetch selected courses
        const fetchSelectedCourses = async () => {
            const response = await fetch('http://localhost:5000/get_user_selected_courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: loggedInUserId })
            });
            if (response.ok) {
                const selectedCourseIds = await response.json();
                setSelectedCourses(selectedCourseIds);
            }
        };

        if (loggedInUserId) {
            fetchUserCourseSessions();
            fetchSelectedCourses();
        }
    }, [loggedInUserId]);

    const translatedCourses = CoursesData.map(course => ({
        ...course,
        title: translations[course.titleKey] || course.title // Fallback to original title if translation is not found
    }));

    return (
        <div className="curriculum-container">
        <div className="overview-box">
            <h1 className="curriculum-title">{text.curriculumTitle}</h1>
            {/* Overview and Stats */}
            <div className="stats">
            <p>{text.totalCourses}: 0</p>
            <p>{text.coursesStarted}: 0</p>
            <p>{text.overallProgress}: 0%</p>
            <p>{text.overallMastery}: 0%</p>
            </div>
            {/* Course Boxes */}
            <div className="course-list">
            {translatedCourses.filter(course => selectedCourses.includes(course.id)).map(course => (
                <CourseBox
                    key={course.id}
                    course={course}
                    loggedInUserId={loggedInUserId}
                    onStartCourse={onStartCourse}
                    userCourseSessions={userCourseSessions}
                />
            ))}
            </div>
        </div>
        </div>
    );
}

export default Curriculum;