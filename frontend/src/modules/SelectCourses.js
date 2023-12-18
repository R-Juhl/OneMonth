// SelectCourses.js
import React, { useState, useContext } from 'react';
import './SelectCourses.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';
import CoursesData from './CoursesData';
import UserIdContext from '../contexts/UserIdContext';

const SelectCourses = () => {
    const { loggedInUserId } = useContext(UserIdContext);
    const { language } = useLanguage();
    const text = language === 'en' ? en : dk;
    const [selectedEducation, setSelectedEducation] = useState('');
    const [selectedCourses, setSelectedCourses] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const handleEducationSelect = (education) => {
        setSelectedEducation(education);
        setSelectedCourses(new Set());
        setSelectAll(false);
    };

    const handleCourseSelect = (courseId, groupID) => {
        const newSelectedCourses = new Set(selectedCourses);

        // Deselect any other course in the same group
        CoursesData.forEach(course => {
            if (course.groupID === groupID && course.id !== courseId) {
                newSelectedCourses.delete(course.id);
            }
        });

        // Select or deselect the clicked course
        if (newSelectedCourses.has(courseId)) {
            newSelectedCourses.delete(courseId);
        } else {
            newSelectedCourses.add(courseId);
        }
        setSelectedCourses(newSelectedCourses);
        setSelectAll(false);
    };

    const handleSelectAllToggle = () => {
        if (selectAll) {
            setSelectedCourses(new Set());
        } else {
            const highestLevelCourses = CoursesData.reduce((acc, course) => {
                if (course.education === selectedEducation) {
                    if (!acc[course.groupID] || course.id < acc[course.groupID]) {
                        acc[course.groupID] = course.id;
                    }
                }
                return acc;
            }, {});
            setSelectedCourses(new Set(Object.values(highestLevelCourses)));
        }
        setSelectAll(prev => !prev);
    };

    const handleSubmit = async () => {
        const selectedCourseIds = Array.from(selectedCourses);
        try {
            const response = await fetch('http://localhost:5000/save_user_courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: loggedInUserId, course_ids: selectedCourseIds })
            });
            const data = await response.json();
            if (response.ok) {
                alert("Courses saved successfully.");
            } else {
                alert(data.error || "Failed to save courses.");
            }
        } catch (error) {
            console.error("Error saving courses:", error);
        }
    };

    const groupedCourses = CoursesData.filter(course => course.education === selectedEducation)
        .reduce((acc, course) => {
            acc[course.groupID] = [...(acc[course.groupID] || []), course];
            return acc;
        }, {});

    return (
        <div className="selectcourses-container">
            <h1>Select Your Courses</h1>
            <div className="education-selection">
                {['STX', 'HHX', 'HTX'].map(education => (
                    <button
                        key={education}
                        className={`education-button ${selectedEducation === education ? 'selected' : ''}`}
                        onClick={() => handleEducationSelect(education)}
                        disabled={education !== 'HHX'}
                    >
                        {education}
                    </button>
                ))}
            </div>

            {selectedEducation && (
                <>
                    <button className="select-all-button" onClick={handleSelectAllToggle}>
                        {selectAll ? 'Deselect All Courses' : 'Select All Courses'}
                    </button>
                    <div className="courses-list">
                        {Object.entries(groupedCourses).map(([groupID, courses]) => (
                            <div key={groupID} className="course-group">
                                {courses.map(course => (
                                    <div key={course.id} className={`course-item ${selectedCourses.has(course.id) ? 'selected' : ''}`}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedCourses.has(course.id)}
                                                onChange={() => handleCourseSelect(course.id, course.groupID)}
                                            />
                                            {course.title}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                </>
            )}
        </div>
    );
};

export default SelectCourses;