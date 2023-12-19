// VariableContent.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import './VariableContent.css';
import UserIdContext from '../contexts/UserIdContext';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

const VariableContent = ({ courseId, courseTitle, onLeaveClass }) => {
  const { loggedInUserId } = useContext(UserIdContext);
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [loadingDots, setLoadingDots] = useState('');
  const [isThreadCreationStarted, setIsThreadCreationStarted] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');

  const handleTTSButtonClick = async (messageText) => {
    // If there's currently playing audio, stop it
    if (isPlaying) {
      setIsPlaying(false);
      setAudioSrc('');
    }
  
    // Call Flask API to get TTS audio
    const response = await fetch('http://localhost:5000/text_to_speech', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ text: messageText })
    });
    const data = await response.json();
  
    // Use the audio URL from the response to set the audio source
    if (data.audio_url) {
      setAudioSrc(data.audio_url);
      setIsPlaying(true);
    }
};

  const fetchInitialMessage = useCallback(async (threadId, courseId, userId) => {
    if (!threadId) {
      console.error('No thread ID available for initial message');
      return;
    }
    const response = await fetch(`http://localhost:5000/course_initial?thread_id=${threadId}&course_id=${courseId}&user_id=${userId}`);
    const data = await response.json();
    console.log("log from fetchInitialMessage with data:", data);
    const formattedInitialMessage = formatText(data.message, 'assistant');
    setMessages([formattedInitialMessage]);
  }, []);

  const fetchAllMessages = useCallback(async (threadId) => {
    const response = await fetch('http://localhost:5000/get_thread_messages', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ thread_id: threadId })
    });
    const data = await response.json();
    if (data.messages) {
      const formattedMessages = data.messages.map(msg => formatText(msg.text, msg.role));
      setMessages(formattedMessages.reverse());
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const initiateCourseSession = async () => {
      if (!isThreadCreationStarted && courseId && courseTitle && loggedInUserId) {
        setIsThreadCreationStarted(true);
        setIsLoading(true);
  
        try {
          // Get or create thread
          const threadResponse = await fetch('http://localhost:5000/get_or_create_course_thread', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_id: loggedInUserId, course_id: courseId })
          });
          const threadData = await threadResponse.json();
          setThreadId(threadData.thread_id);
  
          // Fetch initial or all messages
          if (threadData.isNewThread) {
            await fetchInitialMessage(threadData.thread_id, courseId, loggedInUserId);
          } else {
            await fetchAllMessages(threadData.thread_id);
          }
        } catch (error) {
          console.error('Error handling course session:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    initiateCourseSession();
  }, [courseId, courseTitle, loggedInUserId, isThreadCreationStarted, fetchInitialMessage, fetchAllMessages]);
  

  const handleNext = async (userInput) => {
    console.log("handleNext called with userInput:", userInput);
    if(isLoading) return; // Prevent multiple calls while loading
    setIsLoading(true);

    // Add the user's message to the messages state
    setMessages(prevMessages => [...prevMessages, formatText(userInput, 'user')]);

    const response = await fetch('http://localhost:5000/course_continue', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ thread_id: threadId, user_input: userInput })
    });
    const data = await response.json();
    console.log(data)
    if (data.message) {
      const formattedMessage = formatText(data.message, 'assistant');
      setMessages(prevMessages => [...prevMessages, formattedMessage]);
    }
    setIsLoading(false);
  };

  const handleReady = async () => {
    setIsLoading(true);
    await handleNext("I am ready. Please start teaching me the course");
    setIsReady(true);
  };

  const handleCustomInput = async () => {
    setIsLoading(true);
    await handleNext(customMessage);
    setCustomMessage("");
  };

  useEffect(() => {
    let count = 0;
    if (isLoading) {
      const intervalId = setInterval(() => {
        setLoadingDots('.'.repeat(count % 4));
        count++;
      }, 500); // Adjust the timing as needed

      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  const formatText = (text, role = 'assistant') => {
    let formattedText = `<div class='message-box ${role}'>${text}</div>`;
  
    // Replace markdown-like headings with HTML tags
    formattedText = formattedText.replace(/### (.*?)\n/g, "<h3>$1</h3>");
    // Replace bold markdown-like syntax with HTML bold tags
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Replace newline characters with HTML line breaks
    formattedText = formattedText.replace(/\n/g, "<br>");
  
    return formattedText;
  };

  return (
    <div className='content-container'>
      <h1 className='content-title'>{courseTitle} {text.courseTitle}</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className="message-container">
            <div className="message-box" dangerouslySetInnerHTML={{ __html: msg }}></div>
            <button onClick={() => handleTTSButtonClick(msg)}>🔊</button>
          </div>
        ))}
        {isPlaying && <audio src={audioSrc} autoPlay onEnded={() => setIsPlaying(false)} />}
      </div>
      {isLoading && <p className="loading-text">{text.courseLoadingMsg}{loadingDots}</p>}
      <div className='button-container'>
        {!isReady ? (
          <button className="button-style" onClick={() => handleReady(text.courseReadyPrompt)}>{text.courseReady}</button>
        ) : (
          <>
            <button className="button-style" onClick={() => handleNext(text.courseContinuePrompt)}>{text.courseContinue}</button>
            <button className="button-style" onClick={() => handleNext(text.courseExplainPrompt)}>{text.courseExplain}</button>
            <div>
              <input type="text" placeholder={text.courseCustominput} value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} className="input-style" />
              <button className="button-style" onClick={handleCustomInput}>{text.courseSubmit}</button>
            </div>
          </>
        )}
        <div>
          <button className="button-style" onClick={onLeaveClass}>{text.courseLeave}</button>
        </div>
      </div>
    </div>
  );
};

export default VariableContent;
