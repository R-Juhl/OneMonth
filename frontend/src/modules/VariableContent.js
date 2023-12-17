// VariableContent.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import './VariableContent.css';
import UserIdContext from '../contexts/UserIdContext';

const VariableContent = ({ courseId, courseTitle }) => {
  const { loggedInUserId } = useContext(UserIdContext);
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [loadingDots, setLoadingDots] = useState('');
  const [isThreadCreationStarted, setIsThreadCreationStarted] = useState(false);

  const fetchInitialMessage = useCallback(async (threadId, courseTitle) => {
    if (!threadId) {
      console.error('No thread ID available for initial message');
      return;
    }
    const response = await fetch(`http://localhost:5000/course_initial?thread_id=${threadId}&course_title=${encodeURIComponent(courseTitle)}`);
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
    }
  }, []);

  useEffect(() => {
    const initiateCourseSession = async () => {
      if (!isThreadCreationStarted && courseId && loggedInUserId && courseTitle) {
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
            await fetchInitialMessage(threadData.thread_id, courseTitle);
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
  }, [courseId, loggedInUserId, courseTitle, isThreadCreationStarted, fetchInitialMessage, fetchAllMessages]);
  

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
      <h1 className='content-title'>{courseTitle} Course</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className="message-box" dangerouslySetInnerHTML={{ __html: msg }}></div>
        ))}
      </div>
      {isLoading && <p className="loading-text">Loading{loadingDots}</p>}
      <div className='button-container'>
        {!isReady ? (
          <button className="button-style" onClick={() => handleReady("I am ready. Please start teaching me the course")}>Ready</button>
        ) : (
          <>
            <button className="button-style" onClick={() => handleNext("Please continue teaching me the course")}>Continue</button>
            <button className="button-style" onClick={() => handleNext("Please explain that again, differently, I am not sure I quite understand")}>Explain Further</button>
            <div>
              <input type="text" placeholder="Custom message" value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} className="input-style" />
              <button className="button-style" onClick={handleCustomInput}>Submit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VariableContent;
