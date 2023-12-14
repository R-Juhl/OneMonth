// VariableContent.js
import React, { useState, useEffect, useCallback } from 'react';
import './VariableContent.css';

const VariableContent = ({ isAfsaetningReady, loggedInUserId }) => {
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [isThreadCreationStarted, setIsThreadCreationStarted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [loadingDots, setLoadingDots] = useState('');

  const fetchInitialMessage = useCallback(async (threadId) => {
    if (!threadId) {
      console.error('No thread ID available for initial message');
      return;
    }
    const response = await fetch(`http://localhost:5000/course_initial?thread_id=${threadId}`);
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

  const getOrCreateThread = useCallback(async () => {
    if (isThreadCreationStarted) {
      return;
    }
    setIsThreadCreationStarted(true);
    const response = await fetch('http://localhost:5000/get_or_create_course_thread', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ user_id: loggedInUserId, course_name: 'Afsætning' })
    });
    const data = await response.json();
    console.log("log from getOrCreateThread with data:", data);
    setThreadId(data.thread_id);
    if (data.isNewThread) {
      await fetchInitialMessage(data.thread_id); // Pass thread_id to fetchInitialMessage for new users
    } else {
      await fetchAllMessages(data.thread_id); // Fetch messages for returning users
      setIsReady(true);
    }
  }, [isThreadCreationStarted, loggedInUserId, fetchAllMessages, fetchInitialMessage]);

  useEffect(() => {
    if (isAfsaetningReady && !isThreadCreationStarted) {
      getOrCreateThread();
    }
  }, [isAfsaetningReady, getOrCreateThread, isThreadCreationStarted]);

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
      <h1 className='content-title'>Afsætning Course:</h1>
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
