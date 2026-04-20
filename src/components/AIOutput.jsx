import React from 'react';

const AIOutput = ({ messages }) => {
  // Ensure messages is always an array
  const messageList = Array.isArray(messages) ? messages : [];

  if (messageList.length === 0) {
    return <div className="ai-output"><p>Your AI response will appear here...</p></div>;
  }

  return (
    <div className="ai-output">
      {messageList.map((msg, idx) => (
        <div key={idx} className="chat-message">
          <strong>{msg.role === 'user' ? 'You: ' : 'AI: '}</strong>
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default AIOutput;