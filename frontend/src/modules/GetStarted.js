// GetStarted.js
import React from 'react';
import './GetStarted.css';
import Modal from 'react-modal';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

import freeIcon from '../images/subscriptions/free.png';
import mentorIcon from '../images/subscriptions/mentor.png';
import premiumIcon from '../images/subscriptions/premium.png';
import customIcon from '../images/subscriptions/custom.png';

function GetStarted({ showStartModal, setShowStartModal }) {
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;
  
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

  return (
    <Modal
      className="modal-getstarted"
      isOpen={showStartModal}
      onRequestClose={() => setShowStartModal(false)}
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
              <p>{box.text}</p>
              <button className="select-button">{box.locked ? text.startModalLockedButton : text.startModalSelectButton}</button>
            </div>
          ))}
        </div>
        <button className="close-button" onClick={() => setShowStartModal(false)}>
          {text.globalCloseButton}
        </button>
      </div>
    </Modal>
  );
}

export default GetStarted;
