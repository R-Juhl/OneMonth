// ProgressBar.js
import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ label, percentage }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-label">{label}: {percentage}%</div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
