// GetStarted.js
import React, { useState } from 'react';
import './GetStarted.css';
import Modal from 'react-modal';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

import freeIcon from '../images/subscriptions/free.png';
import mentorIcon from '../images/subscriptions/mentor.png';
import premiumIcon from '../images/subscriptions/premium.png';
import customIcon from '../images/subscriptions/custom.png';

function GetStarted({ showStartModal, setShowStartModal, isLoggedIn, onUserVersionSelect, onSuccessfulSelection }) {
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;
  const [errorMessage, setErrorMessage] = useState("");
  
  const boxes = [
    { 
      id: 1, 
      title: 'Free', 
      imgSrc: freeIcon, 
      locked: true,
      text: (
        <ul>
          <li>{text.startModalFreedesc1}</li>
          <li>{text.startModalFreedesc2}</li>
        </ul>
      )
    },
    { 
      id: 2, 
      title: 'Mentor', 
      imgSrc: mentorIcon,
      locked: true, 
      text: (
        <ul>
          <li>{text.startModalMentordesc1}</li>
          <li>{text.startModalMentordesc2}</li>
        </ul>
      )
    },
    { 
      id: 3, 
      title: 'Premium', 
      imgSrc: premiumIcon, 
      locked: false,
      text: (
        <ul>
          <li>{text.startModalPremiumdesc1}</li>
          <li>{text.startModalPremiumdesc2}</li>
        </ul>
      )
    },
    { 
      id: 4, 
      title: 'Custom', 
      imgSrc: customIcon, 
      locked: true,
      text: (
        <ul>
          <li>{text.startModalCustomdesc1}</li>
          <li>{text.startModalCustomdesc2}</li>
        </ul>
      )
    },
  ];

  const handleSelectClick = async (userVersion) => {
    if (!isLoggedIn) {
      setErrorMessage("You need to be logged in to select a subscription model");
      return;
    }
    setErrorMessage("");
    await onUserVersionSelect(userVersion);
    onSuccessfulSelection(); // Call the callback function after successful selection
  };

  // Clear errors when the modals are closed
  const closeModal = (errorType) => {
    if (errorType === 'usernotloggedinError') {
      setShowStartModal(false)
      setErrorMessage('');
    } else if (errorType === 'insufficientfundsError') {
      // include other future error types here such as insufficient funds, etc.
    } else if (errorType === '') {
      setShowStartModal(false)
      setErrorMessage('');
    } 
  };

  return (
    <Modal
      className="modal-getstarted"
      isOpen={showStartModal}
      onRequestClose={() => closeModal('usernotloggedinError')}
    >
      {/* Modal content */}
      <div className="get-started-container">
        <h2>{text.startModalTitle}</h2>
        <div>
          <h3>{text.startModalDescription}</h3>
        </div>
        <div className="boxes-container">
          {boxes.map((box) => (
            <div className={`box ${box.locked ? 'locked' : ''}`} key={box.id}>
              <h3>{box.title}</h3>
              <img src={box.imgSrc} alt={box.title} className={box.locked ? 'locked' : ''}/>
              <div>{box.text}</div>
              {/*<button className="select-button">{box.locked ? text.startModalLockedButton : text.startModalSelectButton}</button>*/}
              <button 
                className="select-button" 
                onClick={() => handleSelectClick(box.title.toLowerCase())}
                disabled={box.locked}
              >
                {box.locked ? text.startModalLockedButton : text.startModalSelectButton}
              </button>
            </div>
          ))}
        </div>
        <button className="close-button" onClick={() => closeModal('')}>
          {text.globalCloseButton}
        </button>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </Modal>
  );
}

export default GetStarted;
