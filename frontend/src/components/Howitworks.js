import React from 'react';
import './Howitworks.css';
import Modal from 'react-modal';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

function Howitworks({ showHowitworksModal, setShowHowitworksModal }) {
    const { language } = useLanguage();
    const text = language === 'en' ? en : dk;

    return (
        <Modal
            className="howitworksModal"
            isOpen={showHowitworksModal}
            onRequestClose={() => setShowHowitworksModal(false)}
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
            <h2>{text.howitworksModalTitle}</h2>
            <button onClick={() => setShowHowitworksModal(false)}>{text.globalCloseButton}</button>
        </Modal>
    );
}

export default Howitworks;
