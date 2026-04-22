import React from 'react';

const AIOutput = ({ messages }) => {
  // Ensure messages is always an array
  const messageList = Array.isArray(messages) ? messages : [];
  const formatRole = (role) => {
  if (role === 'user') return 'You';

  if (role.includes('gemma')) return 'Gemma';
  if (role.includes('llama')) return 'Llama';
  if (role.includes('smollm')) return 'SmolLM';

  return role; // fallback
};


  if (messageList.length === 0) {
    return <div className="ai-output"><p>Your AI response will appear here...</p></div>;
  }

  return (
    <div className="ai-output">
      {messageList.map((msg, idx) => (
        <div key={idx} className="chat-message">
          <strong>{msg.role === 'user' ? 'You: ' : `${formatRole(msg.role)}: `}</strong>
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default AIOutput;