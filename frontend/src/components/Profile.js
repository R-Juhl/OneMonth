import React from 'react';
import './Profile.css';
import Modal from 'react-modal';

function Profile({ showProfileModal, setShowProfileModal }) {

    return (
        <Modal
            className="modal"
            isOpen={showProfileModal}
            onRequestClose={() => setShowProfileModal(false)}
        >
            {/* Modal content */}
            <h2>Profile</h2>
            <button onClick={() => setShowProfileModal(false)}>Close</button>
        </Modal>
    );
}

export default Profile;
