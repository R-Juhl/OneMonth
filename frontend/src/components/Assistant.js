// Assistant.js
import React, { useState, useEffect } from 'react';
import './Assistant.css';

// Import avatars
import avatarDefault from '../images/assistants/avatar_default.png';
import avatar1 from '../images/assistants/avatar_1.png';

// Define avatars
const avatars = {
    avatar_d: avatarDefault,
    avatar_1: avatar1,
    avatar_2: "/path/to/avatar-2.png",
    // setAvatar(avatars.avatar1); // To set to avatar 1
  };

function Assistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([{role: 'assistant', content: 'Hi, what can I help you with?'}]);
    const [newMessage, setNewMessage] = useState('');
    const [personality] = useState('friendly and supportive');
    const [showHelpText, setShowHelpText] = useState(true);
    const [avatar, setAvatar] = useState(avatars.avatar_d);
    const [msgLoading, setMsgLoading] = useState(false);

    const scrollToBottom = () => {
        const chatHistoryEl = document.querySelector(".chat-history");
        if (chatHistoryEl) {
            chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
        }
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen, chatHistory]);

    const handleAvatarClick = () => {
        setIsOpen(!isOpen);
        setShowHelpText(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Unfocused text input handling
    const handleTextareaFocus = () => {
        const chatEl = document.querySelector('.assistant-chat');
        const buttonEl = document.querySelector('.chat-input button');
        if (chatEl) {
            chatEl.classList.add('textarea-focused');
            buttonEl.classList.add('textarea-focused');
        }
    };

    const handleTextareaBlur = () => {
        const chatEl = document.querySelector('.assistant-chat');
        const buttonEl = document.querySelector('.chat-input button');
        if (chatEl) {
            chatEl.classList.remove('textarea-focused');
            buttonEl.classList.remove('textarea-focused');
        }
    };
    
    const sendMessage = async () => {
        const userMessage = {role: 'user', content: newMessage};
        setChatHistory(currentHistory => [...currentHistory, userMessage]);
        setMsgLoading(true);

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
            setChatHistory(currentHistory => [...currentHistory, {role: 'assistant', content: data.response}]);
            //setMsgLoading(false);
        } catch (error) {
            console.error('Error sending message:', error);
            //setMsgLoading(false);
        }
        //document.querySelector('.chat-input textarea')?.blur();
        setNewMessage('');
        setMsgLoading(false);
    };

    return (
        <div className="assistant-container">
            <div className={`assistant-avatar ${isOpen ? 'open' : ''}`} onClick={handleAvatarClick}>
                <img src={avatar} alt="Assistant Avatar"/>
                {showHelpText && <div className="help-text"><span>Need help?<br></br> Click me</span></div>}
            </div>
            <div className="loading-container">
                {msgLoading && <p className="loading-text"></p>}
            </div>

            {isOpen && (
                <div className="assistant-chat">
                    <div className="top-bar">
                        <button className="close-button" onClick={() => setIsOpen(false)}>&times;</button>
                    </div>
                    <div className="chat-history">
                        {chatHistory.map((entry, index) => (
                            <div key={index} className={`message ${entry.role}`}>{entry.content}</div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <textarea
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={handleTextareaFocus}
                            onBlur={handleTextareaBlur}
                            rows={5}
                            placeholder="Type your message..."
                        />
                        <button className="send-button" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Assistant;
