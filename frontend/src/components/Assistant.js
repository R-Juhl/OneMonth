// Assistant.js
import React, { useState } from 'react';
import './Assistant.css';

// Import avatars
import avatarDefault from '../images/assistants/avatar_default.png';
import avatar1 from '../images/assistants/avatar_1.png';

// Define avatars
const avatars = {
    avatar_d: avatarDefault,
    avatar_1: avatar1,
    avatar_2: "/path/to/avatar-2.png",
    // Add more as needed

    // setAvatar(avatars.avatar1); // To set to avatar 1
  };

function Assistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([{role: 'assistant', content: 'Hi, what can I help you with?'}]);
    const [newMessage, setNewMessage] = useState('');
    const [personality] = useState('friendly and supportive');
    const [avatar, setAvatar] = useState(avatars.avatar_d); // Initialize with the default avatar

    const sendMessage = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/assistant`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    message: newMessage,
                    chat_history: chatHistory.slice(-5),
                    personality: personality
                })
            });
            const data = await response.json();
            setChatHistory([...chatHistory, {role: 'user', content: newMessage}, {role: 'assistant', content: data.response}]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="assistant-container">
        <div className={`assistant-avatar ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <img src={avatar} alt="Assistant Avatar"/>
            <span>Need help? Click me</span>
        </div>
        {isOpen && (
            <div className="assistant-chat">
            <button className="close-button" onClick={() => setIsOpen(false)}>X</button>
            <div className="chat-history">
                {chatHistory.map((entry, index) => (
                <div key={index} className={`message ${entry.role}`}>{entry.content}</div>
                ))}
            </div>
            <div className="chat-input">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
                <button onClick={sendMessage}>Send</button>
            </div>
            </div>
        )}
        </div>
    );
}

export default Assistant;
