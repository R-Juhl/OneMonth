// CourseBox.js
import React from 'react';
import './CourseBox.css';

const CourseBox = ({ course }) => {
  // Construct the image path using the course id
  const imagePath = require(`../images/courses/${course.id}.png`);

  return (
    <div className={`course-box ${course.started ? 'started' : 'not-started'}`}>
      {/* Use the dynamic imagePath for the src attribute */}
      <img src={imagePath} alt={course.title} className="course-image" />
      <div className="course-info">
        <h2 className="course-title">{course.title}</h2>
        {course.started ? (
          <>
            <p>Progress: {course.progress}%</p>
            <p>Mastery: {course.mastery}%</p>
            <p>Points earned: {course.pointsEarned}</p>
            <p>Exercises: {course.exercises}</p>
            <button className="continue-button">Continue Course</button>
          </>
        ) : (
          <button className="start-button">Start Class</button>
        )}
      </div>
    </div>
  );
};

export default CourseBox;