import React, { useState } from 'react';

const PromptInput = ({ onSend, loading = false, error = '' }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(prompt);   
    setPrompt('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="prompt-form">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything..."
          className="prompt-input"
          disabled={loading}
        />
        <button type="submit" className="prompt-submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PromptInput;