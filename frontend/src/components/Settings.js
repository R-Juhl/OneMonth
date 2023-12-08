import React from 'react';
import './Settings.css';
import Modal from 'react-modal';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

function Settings({ showSettingsModal, setShowSettingsModal, setAvatar, avatars, isLoggedIn, loggedInUserId }) {
    const { language, setLanguage } = useLanguage();
    const text = language === 'en' ? en : dk;

    const handleLanguageChange = async (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);

        if (isLoggedIn && loggedInUserId) {
          try {
            await fetch('http://localhost:5000/update_language', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: loggedInUserId, language: newLanguage })
            });
          } catch (error) {
            console.error('Error updating language preference:', error);
          }
        }
    };

    const handleAvatarClick = (avatar) => {
        setAvatar(avatar);
        const clickedAvatar = document.querySelector(`img[src='${avatar}']`);
        clickedAvatar.classList.add('clicked');
        setTimeout(() => {
            clickedAvatar.classList.remove('clicked');
        }, 200); // 0.2 seconds
    };

    return (
        <Modal
            className="modal"
            isOpen={showSettingsModal}
            onRequestClose={() => setShowSettingsModal(false)}
        >
            {/* Modal content */}
            <h2>{text.settingsModalTitle}</h2>
            <div>
                <h3>{text.settingsModalSelectlanguage}</h3>
                <select onChange={handleLanguageChange} value={language} className="language-selector">
                    <option value="en">{text.settingsModalSelectenglish}</option>
                    <option value="dk">{text.settingsModalSelectdanish}</option>
                </select>
            </div>
            <div>
            <h3>{text.settingsModalSelectaiavatar}</h3>
                <div>
                    <img src={avatars.avatar_d} alt="Default Avatar" onClick={() => handleAvatarClick(avatars.avatar_d)} />
                    <img src={avatars.avatar_1} alt="Avatar 1" onClick={() => handleAvatarClick(avatars.avatar_1)} />
                    <img src={avatars.avatar_2} alt="Avatar 2" onClick={() => handleAvatarClick(avatars.avatar_2)} />
                    <img src={avatars.avatar_3} alt="Avatar 3" onClick={() => handleAvatarClick(avatars.avatar_3)} />
                    <img src={avatars.avatar_4} alt="Avatar 4" onClick={() => handleAvatarClick(avatars.avatar_4)} />
                    <img src={avatars.avatar_5} alt="Avatar 5" onClick={() => handleAvatarClick(avatars.avatar_5)} />
                    <img src={avatars.avatar_6} alt="Avatar 6" onClick={() => handleAvatarClick(avatars.avatar_6)} />
                    <img src={avatars.avatar_7} alt="Avatar 7" onClick={() => handleAvatarClick(avatars.avatar_7)} />
                    <img src={avatars.avatar_8} alt="Avatar 8" onClick={() => handleAvatarClick(avatars.avatar_8)} />
                    <img src={avatars.avatar_9} alt="Avatar 9" onClick={() => handleAvatarClick(avatars.avatar_9)} />
                    <img src={avatars.avatar_10} alt="Avatar 10" onClick={() => handleAvatarClick(avatars.avatar_10)} />
                    <img src={avatars.avatar_11} alt="Avatar 11" onClick={() => handleAvatarClick(avatars.avatar_11)} />
                    <img src={avatars.avatar_12} alt="Avatar 12" onClick={() => handleAvatarClick(avatars.avatar_12)} />
                    <img src={avatars.avatar_13} alt="Avatar 13" onClick={() => handleAvatarClick(avatars.avatar_13)} />
                    <img src={avatars.avatar_14} alt="Avatar 14" onClick={() => handleAvatarClick(avatars.avatar_14)} />
                    <img src={avatars.avatar_15} alt="Avatar 15" onClick={() => handleAvatarClick(avatars.avatar_15)} />
                    <img src={avatars.avatar_16} alt="Avatar 16" onClick={() => handleAvatarClick(avatars.avatar_16)} />
                    <img src={avatars.avatar_17} alt="Avatar 17" onClick={() => handleAvatarClick(avatars.avatar_17)} />
                    <img src={avatars.avatar_18} alt="Avatar 18" onClick={() => handleAvatarClick(avatars.avatar_18)} />
                    <img src={avatars.avatar_19} alt="Avatar 19" onClick={() => handleAvatarClick(avatars.avatar_19)} />
                    <img src={avatars.avatar_20} alt="Avatar 20" onClick={() => handleAvatarClick(avatars.avatar_20)} />
                    <img src={avatars.avatar_21} alt="Avatar 21" onClick={() => handleAvatarClick(avatars.avatar_21)} />
                    <img src={avatars.avatar_22} alt="Avatar 22" onClick={() => handleAvatarClick(avatars.avatar_22)} />
                    <img src={avatars.avatar_23} alt="Avatar 23" onClick={() => handleAvatarClick(avatars.avatar_23)} />
                </div>
                <div>
                    <h3>{text.settingsModalSelectpremiumavatar}</h3>
                    <img src={avatars.avatar_p1} alt="Avatar P1" onClick={() => handleAvatarClick(avatars.avatar_p1)} />
                    <img src={avatars.avatar_p2} alt="Avatar P2" onClick={() => handleAvatarClick(avatars.avatar_p2)} />
                </div>
            </div>
            <button onClick={() => setShowSettingsModal(false)}>{text.globalCloseButton}</button>
        </Modal>
    );
}

export default Settings;
