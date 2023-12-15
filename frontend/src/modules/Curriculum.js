// Curriculum.js
import React from 'react';
import './Curriculum.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';
import CourseBox from './CourseBox';

const coursesData = [
    {
        id: 1,
        title: 'Afsætning',
        started: true,
        progress: 50,
        mastery: 40,
        pointsEarned: 1000,
        exercises: 10
    },
    {
        id: 2,
        title: 'Virksomhedsøkonomi',
        started: false,
        progress: 0,
        mastery: 0,
        pointsEarned: 0,
        exercises: 0
    },
// Add more course objects here
];

function Curriculum() {
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
          {coursesData.map(course => (
            <CourseBox key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Curriculum;