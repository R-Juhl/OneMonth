// CourseBox.js
import React, { useContext } from 'react';
import './CourseBox.css';
import ProgressBar from './ProgressBar';
import UserIdContext from '../contexts/UserIdContext';

const CourseBox = ({ course, onStartCourse }) => {
  const { loggedInUserId } = useContext(UserIdContext);

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
    <div className={`course-box ${course.started ? 'started' : 'not-started'}`}>
      {imagePath && <img src={imagePath} alt={course.title} className="course-image" />}
      <div className="course-info">
        <h2 className="course-title">{course.title}</h2>
        {course.started ? (
          <>
            <ProgressBar label="Progress" percentage={course.progress} />
            <ProgressBar label="Mastery" percentage={course.mastery} />
            <p>Points earned: {course.pointsEarned}</p>
            <p>Exercises: {course.exercises}</p>
            <button onClick={startSession}>Continue Course</button>
          </>
        ) : (
          <button onClick={startSession}>Start Class</button>
        )}
      </div>
    </div>
  );
};

export default CourseBox;