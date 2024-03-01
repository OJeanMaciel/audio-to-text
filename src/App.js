import React, { useState, useEffect } from 'react';
import './App.css';
import { FaMicrophone, FaPaperPlane, FaVolumeUp, FaPlay } from 'react-icons/fa';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        if (event.results[0].isFinal) {
          setMessages((prevMessages) => [...prevMessages, transcript]);
        }
      };
      setSpeechRecognition(recognition);
    } else {
      alert('API SpeechRecognition não suportada neste navegador.');
    }
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, inputMessage]);
      setInputMessage('');
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const speakMessage = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (speechRecognition) {
      speechRecognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message}
              <button className="voice-button" onClick={() => speakMessage(message)}>
                <FaVolumeUp />
              </button>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="chat-input"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma mensagem..."
          />
          <button className="send-button" onClick={handleSendMessage}>
            <FaPaperPlane />
          </button>
          <button
            className={`send-button ${isListening ? 'listening-button' : ''}`}
            onClick={startListening}
            disabled={isListening}
          >
            {isListening ? <FaPlay /> : <FaMicrophone />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
