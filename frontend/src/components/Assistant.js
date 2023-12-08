// Assistant.js
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import './Assistant.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

function Assistant({ avatar }) {
    const { language } = useLanguage();
    const text = language === 'en' ? en : dk;
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([{role: 'assistant', content: text.assistantGreeting}]);
    const [newMessage, setNewMessage] = useState('');
    const [personality] = useState(text.assistantPersonalityDef);
    const [showHelpText, setShowHelpText] = useState(true);
    const [msgLoading, setMsgLoading] = useState(false);
    const [loadingDots, setLoadingDots] = useState('');

    const scrollToBottom = () => {
        const chatHistoryEl = document.querySelector(".chat-history");
        if (chatHistoryEl) {
            chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
        }
    };

    useEffect(() => {
        setChatHistory([{role: 'assistant', content: text.assistantGreeting}]);
    }, [language, text.assistantGreeting]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen, chatHistory]);

    useEffect(() => {
        let count = 0;
        if (msgLoading) {
            const intervalId = setInterval(() => {
                setLoadingDots('.'.repeat(count % 4));
                count++;
            }, 500); // Adjust the timing as needed

            return () => clearInterval(intervalId);
        }
    }, [msgLoading]);

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
                    personality: personality,
                    language: language
                })
            });
            const data = await response.json();
            setChatHistory(currentHistory => [...currentHistory, {role: 'assistant', content: data.response}]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
        setNewMessage('');
        setMsgLoading(false);
    };

    return (
        <div className="assistant-container">
            <div className={`assistant-avatar ${isOpen ? 'open' : ''}`} onClick={handleAvatarClick}>
                <img src={avatar} alt="Assistant Avatar" />
                {showHelpText && <div className="help-text">{parse(text.assistantHelpMsg)}</div>}
            </div>
            <div className="loading-container">
                {msgLoading && <p className="loading-text">{`${text.assistantLoadingMsg} ${loadingDots}`}</p>}
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
                            placeholder={text.assistantTextInputPlaceholder}
                        />
                        <button className="send-button" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Assistant;
