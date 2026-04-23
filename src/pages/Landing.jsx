import React, { useState, useEffect } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import AccountIcon from '../components/AccountIcon';
import Greeting from '../components/Greeting';
import PromptInput from '../components/PromptInput';
import AIOutput from '../components/AIOutput';
import FlyoutPanel from '../components/FlyoutPanel';
import AuthModal from '../components/AuthModal';
import ModelSelector from '../components/ModelSelector';
import ModelManagementPanel from '../components/ModelManagementPanel';
import './Landing.css';



const Landing = () => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
<<<<<<< HEAD
  // eslint-disable-next-line no-unused-vars
=======
>>>>>>> 85efc3d (Add Cucumber BDD tests for model management (J1, J2))
  const [selectedModels, setSelectedModels] = useState(['gemma3:270m']);
  const [models, setModels] = useState([
  { id: 'gemma3:270m', name: 'Gemma', showInSelector: true },
  { id: 'smollm2:135m', name: 'SmolLM', showInSelector: true },
  { id: 'tinyllama', name: 'TinyLlama', showInSelector: true }
]);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  

  // Restore session on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setIsLoggedIn(true);
      setUsername(storedUser);
      setRefreshHistory(prev => prev + 1); 
    }
  }, []);

  // Load conversation history when logged in or refreshHistory changes
useEffect(() => {
  console.log('Loading history, isLoggedIn:', isLoggedIn, 'username:', username);

  if (!isLoggedIn || !username) return;
  //avoid bug overlay
  if (messages.length > 0) return;

  const loadHistory = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/history?username=${username}`);
      const conversations = await res.json();

      if (conversations.length > 0) {
        const last = conversations[0];
        setConversationId(last.id);

        const msgRes = await fetch(`http://localhost:3001/api/conversation/${last.id}`);
        const msgs = await msgRes.json();

        setMessages(msgs);
      } else {
        setMessages([]);
        setConversationId(null);
      }

    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  loadHistory();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [isLoggedIn, username]); //  refreshHistory





  const toggleFlyout = () => setIsFlyoutOpen(!isFlyoutOpen);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.username);
    localStorage.setItem('username', userData.username);
    // Force history reload
    setRefreshHistory(prev => prev + 1);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setMessages([]);
    setConversationId(null);
    localStorage.removeItem('username');
    window.location.reload();
  };

  const handleSend = async (prompt) => {
    if (!prompt.trim()) {
      setError('Please enter a message');
      return;
    }
    setError('');
    setLoading(true);

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);

    try {
      const body = {
        prompt,
        models: selectedModels,
        username: isLoggedIn ? username : null,
        conversationId: isLoggedIn ? conversationId : null,
      };
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'LLM failed');

const newMessages = data.responses.map(r => ({
  role: r.model,
  content: r.response
}));

setMessages(prev => [
  ...prev,
  ...newMessages
]);
      if (isLoggedIn && data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      // Refresh history to update the side panel
      setRefreshHistory(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Optionally remove the optimistically added user message
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const openChat = ({ messages, conversationId }) => {
    setMessages(messages);
    setConversationId(conversationId);
  };

  return (
    <div className="landing-container">
      <FlyoutPanel
        isOpen={isFlyoutOpen}
        onClose={() => setIsFlyoutOpen(false)}
        isLoggedIn={isLoggedIn}
        onLoginClick={openAuthModal}
        username={username}
        refreshHistory={refreshHistory}
        onOpenChat={openChat}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} onLoginSuccess={handleLoginSuccess} />
      <header className="top-bar">
        
        <div className="top-left">
          <HamburgerMenu onClick={toggleFlyout} />
        </div>



        <div className="top-center">
          <Greeting username={username} />

          <PromptInput onSend={handleSend} loading={loading} error={error} />
<div className="model-row">

  <button
    className="model-toggle-btn"
    onClick={() => setIsModelPanelOpen(prev => !prev)}
  >
    {isModelPanelOpen ? '>' : '<'}
  </button>

  <ModelSelector
    models={models}
    selectedModels={selectedModels}
    setSelectedModels={setSelectedModels}
  />

  {isModelPanelOpen && (
    <ModelManagementPanel
      models={models}
      setModels={setModels}
      selectedModels={selectedModels}
      setSelectedModels={setSelectedModels}
    />
  )}

</div>
        </div>
        <div className="top-right">
          <AccountIcon onLoginClick={openAuthModal} onLogout={handleLogout} isLoggedIn={isLoggedIn} />
        </div>
      </header>
      <main className="ai-output-area">
        <AIOutput messages={messages} />
      </main>
    </div>
  );
};

export default Landing;
