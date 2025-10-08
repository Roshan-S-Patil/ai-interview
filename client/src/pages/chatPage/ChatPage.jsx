import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  X, 
  Send, 
  ArrowLeft, 
  Clock, 
  User, 
  Bot,
  Volume2,
  VolumeX,
  Copy,
  Check
} from 'lucide-react';
import styles from './ChatPage.module.css';
import { askTextQuestion } from '../../api/chatapi';
import ReactMarkdown  from 'react-markdown'

const ChatPage = () => {
  const { topicId } = useParams();
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionStartTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [isTyping, setIsTyping] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get session type from URL params (interview or discussion)
  const urlParams = new URLSearchParams(location.search);
  const sessionType = urlParams.get('type') || 'discussion';

  // Topic details mapping
  const topicDetails = {
    'mern': { title: 'MERN Stack', icon: '🌐', color: 'from-green-400 to-blue-500' },
    'java': { title: 'Java Development', icon: '☕', color: 'from-orange-400 to-red-500' },
    'sql': { title: 'SQL & Databases', icon: '🗄️', color: 'from-blue-400 to-purple-500' },
    'python': { title: 'Python Programming', icon: '🐍', color: 'from-yellow-400 to-green-500' },
    'react': { title: 'React.js', icon: '⚛️', color: 'from-cyan-400 to-blue-600' },
    'nodejs': { title: 'Node.js Backend', icon: '🟢', color: 'from-green-500 to-emerald-600' },
    'mobile': { title: 'Mobile Development', icon: '📱', color: 'from-purple-400 to-pink-500' },
    'devops': { title: 'DevOps & Cloud', icon: '☁️', color: 'from-indigo-400 to-purple-600' },
    'git': { title: 'Git & Version Control', icon: '🔀', color: 'from-gray-600 to-gray-800' },
    'security': { title: 'Cybersecurity', icon: '🛡️', color: 'from-red-500 to-pink-600' }
  };

  const currentTopic = topicDetails[topicId] || { 
    title: 'Unknown Topic', 
    icon: '❓', 
    color: 'from-gray-400 to-gray-600' 
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - sessionStartTime;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage = sessionType === 'interview' 
      ? `Welcome to your ${currentTopic.title} mock interview! I'm your AI interviewer. Let's begin with some questions to assess your knowledge. Are you ready?`
      : `Hi! I'm here to help you learn about ${currentTopic.title}. Feel free to ask me anything or let's start with some fundamental concepts. What would you like to explore first?`;

    setMessages([{
      id: 1,
      text: welcomeMessage,
      sender: 'ai',
      timestamp: new Date()
    }]);
  }, [topicId, sessionType, currentTopic.title]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      // Start speech recognition here
      console.log('Starting speech recognition...');
    }
  };

  const handleMicAction = (action) => {
    if (action === 'mute') {
      setIsMuted(true);
      setIsListening(false);
    } else if (action === 'cancel') {
      setIsListening(false);
      setIsMuted(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    try {
      const response = await askTextQuestion({
        "thread_id": "1",
        messages: [
          { role: "human", content: inputMessage }
        ]
      });
      console.log('AI Response:', response);
      const aiReply = response?.data?.messages[0]?.content || "I'm sorry, I didn't understand that.";
      if (response.data) {
        const aiResponse = {
        id: messages.length + 2,
        text: aiReply,
        sender: 'ai',
        timestamp: new Date()
      }; 
      setMessages(prev => [...prev, aiResponse]);
    }
      // setIsTyping(false);
    } catch (error) {
      console.log('Error fetching AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const copySessionLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
          </button>
          <div className={styles.sessionInfo}>
            <div className={styles.topicIcon}>{currentTopic.icon}</div>
            <div>
              <h1 className={styles.topicTitle}>{currentTopic.title}</h1>
              <p className={styles.sessionType}>
                {sessionType === 'interview' ? 'Mock Interview' : 'Learn & Discuss'}
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.timer}>
            <Clock size={16} />
            <span>{elapsedTime}</span>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.audioToggle}
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? 'Disable audio' : 'Enable audio'}
            >
              {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button 
              className={styles.shareButton}
              onClick={copySessionLink}
              title="Copy session link"
            >
              {linkCopied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Chat Section */}
      <div className={styles.chatSection}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.aiMessage
              }`}
            >
              <div className={styles.messageAvatar}>
                {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={styles.messageContent}>
                {/* <p className={styles.messageText}> */}
                  <ReactMarkdown style={{color:"white"}}>{message.text}</ReactMarkdown>
                {/* </p> */}
                <span className={styles.messageTime}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <div className={styles.messageAvatar}>
                <Bot size={16} />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className={styles.inputSection}>
          <form onSubmit={handleSendMessage} className={styles.inputForm}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask about ${currentTopic.title}...`}
              className={styles.messageInput}
              disabled={isListening}
            />
            
            {/* Microphone Button */}
            <div className={styles.micContainer}>
              {!isListening ? (
                <button
                  type="button"
                  className={`${styles.micButton} ${isMuted ? styles.micMuted : ''}`}
                  onClick={handleMicClick}
                  disabled={isMuted}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              ) : (
                <div className={styles.micActiveContainer}>
                  <button
                    type="button"
                    className={`${styles.micButton} ${styles.micActive}`}
                  >
                    <Mic size={20} />
                    <div className={styles.glowAnimation}></div>
                  </button>
                  
                  <div className={styles.micActions}>
                    <button
                      type="button"
                      className={styles.micActionButton}
                      onClick={() => handleMicAction('mute')}
                      title="Mute"
                    >
                      <MicOff size={16} />
                    </button>
                    <button
                      type="button"
                      className={styles.micActionButton}
                      onClick={() => handleMicAction('cancel')}
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.sendButton}
              disabled={!inputMessage.trim() || isListening}
            >
              <Send size={20} />
            </button>
          </form>
          
          {isListening && (
            <div className={styles.listeningIndicator}>
              <div className={styles.soundWaves}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Listening... Speak now</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;