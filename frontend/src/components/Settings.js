import React from 'react';
import './Settings.css';
import Modal from 'react-modal';

function Settings({ showSettingsModal, setShowSettingsModal, setAvatar, avatars, setLanguage, language }) {

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <Modal
            className="modal"
            isOpen={showSettingsModal}
            onRequestClose={() => setShowSettingsModal(false)}
        >
            {/* Modal content */}
            <h2>Settings</h2>
            <div>
                <h3>Select AI avatar</h3>
                <img src={avatars.avatar_d} alt="Default Avatar" onClick={() => setAvatar(avatars.avatar_d)} />
                <img src={avatars.avatar_1} alt="Avatar 1" onClick={() => setAvatar(avatars.avatar_1)} />
            </div>
            <div>
                <h3>Select language</h3>
                <select onChange={handleLanguageChange} value={language}>
                    <option value="eng">English</option>
                    <option value="dk">Danish</option>
                </select>
            </div>
            <button onClick={() => setShowSettingsModal(false)}>Close</button>
        </Modal>
    );
}

export default Settings;
