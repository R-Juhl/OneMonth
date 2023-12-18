// CourseBox.js
import React, { useContext } from 'react';
import './CourseBox.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

import ProgressBar from './ProgressBar';
import UserIdContext from '../contexts/UserIdContext';

const CourseBox = ({ course, onStartCourse, userCourseSessions }) => {
  const { loggedInUserId } = useContext(UserIdContext);
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;
  const hasStartedCourse = userCourseSessions.some(session => session.course_id === course.id);

  // Construct the image path using the course id
  let imagePath;
  try {
    imagePath = require(`../images/courses/${course.id}.png`);
  } catch (err) {
    console.warn(`Image not found for course id ${course.id}`);
  }

  const startSession = () => {
    if (loggedInUserId === undefined) {
      console.error("loggedInUserId is undefined");
      return;
    }
    onStartCourse(course.id, course.title, loggedInUserId);
  };

  return (
    <div className={`course-box ${hasStartedCourse ? 'started' : 'not-started'}`}>
      {imagePath && <img src={imagePath} alt={course.title} className="course-image" />}
      <div className="course-info">
        <h2 className="course-title">{course.title}</h2>
        {hasStartedCourse ? (
          <>
            <ProgressBar label={text.progress} percentage={course.progress} />
            <ProgressBar label={text.mastery} percentage={course.mastery} />
            <p>{text.pointsEarned}: {course.pointsEarned}</p>
            <p>{text.exercisesCompleted}: {course.exercises}</p>
            <button onClick={startSession}>{text.continueClass}</button>
          </>
        ) : (
          <button onClick={startSession}>{text.startClass}</button>
        )}
      </div>
    </div>
  );
};

export default CourseBox;