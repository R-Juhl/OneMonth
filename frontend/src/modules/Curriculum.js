// Curriculum.js
import React, { useContext } from 'react';
import './Curriculum.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';
import CourseBox from './CourseBox';
import CoursesData from './CoursesData';
import UserIdContext from '../contexts/UserIdContext';

const Curriculum = ({ onStartCourse }) => {
    const { loggedInUserId } = useContext(UserIdContext);
    const { language } = useLanguage();
    const text = language === 'en' ? en : dk;

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
            {CoursesData.map(course => (
                <CourseBox
                    key={course.id}
                    course={course}
                    loggedInUserId={loggedInUserId}
                    onStartCourse={onStartCourse}
                />
            ))}
            </div>
        </div>
        </div>
    );
}

export default Curriculum;