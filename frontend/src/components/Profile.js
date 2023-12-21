import React from 'react';
import './Profile.css';
import Modal from 'react-modal';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

function Profile({ showProfileModal, setShowProfileModal }) {
    const { language } = useLanguage();
    const text = language === 'en' ? en : dk;

    return (
        <Modal
            className="profileModal"
            isOpen={showProfileModal}
            onRequestClose={() => setShowProfileModal(false)}
            style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark semi-transparent background
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }
            }}
        >
            {/* Modal content */}
            <h2>{text.profileModalTitle}</h2>
            <button onClick={() => setShowProfileModal(false)}>{text.globalCloseButton}</button>
        </Modal>
    );
}

export default Profile;
