import React from 'react';
import History from './History';
import {useState} from 'react';


const FlyoutPanel = ({ isOpen, onClose, isLoggedIn, onLoginClick, username ,refreshHistory,onOpenChat}) => {
const [searchMode, setSearchMode] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
  if (!isOpen) return null; // Don't render anything if panel is closed
  return (
    <>
      {/* Overlay - covers the whole screen */}
      <div
        data-testid="flyout-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent dark
          zIndex: 1000, // behind the panel
        }}
        onClick={onClose} // click overlay to close
      />

      {/* Flyout Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100%',
          backgroundColor: '#333',
          color: 'white',
          zIndex: 1001, // above overlay
          padding: '1.5rem',
          boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Optional close button inside panel */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {!isLoggedIn ? (
          <>
            <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
              Logged in users can save chats
            </p>
            <button
              style={{
              backgroundColor: '#cba6f7',
              color: '#11111b',
              border: 'none',
              padding: '0.75rem',
              width: '100%',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => {
              onClose();
              onLoginClick();
            }}
            >
              Log in
            </button>
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                right: '1.5rem',
              }}
            >
              <button
                style={{
                  backgroundColor: '#313244',
                  color: '#cdd6f4',
                  border: '1px solid #45475a',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
                onClick={() => alert('Help clicked')}
              >
                ?
              </button>
            </div>
          </>
        ):(
          <>
           <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {/* NEW CHAT */}
            <button
            style={{
              backgroundColor: '#11111b',
              color: '#cba6f7',
              border: 'none',
              padding: '0.75rem',borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              flex: searchMode ? 1 : 3,
              minWidth: '50px',
              transition: 'flex 0.25s ease',
            }}
            onClick={() => {onOpenChat({messages: [],conversationId: null});
              onClose();
            }}
            >
              {searchMode ? '+' : '+ NEW CHAT'}
              </button>
              {/* SEARCH*/}
               {searchMode ? (
                <div  style={{    position: 'relative',
                  flex: searchMode ? 3 : 1,
                  marginRight: '1rem',
                  transition: 'flex 0.25s ease',
                   }}
>
                  {/* 🔍 icon inside */}
                  <span
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                  >🔍
                  </span>
                  <input
                  type="search"
                  placeholder="Search query"
                  autoFocus
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                  style={{width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2rem',
                    borderRadius: '8px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: '#2b2b2b',
                    color: 'white',
                    cursor: 'text',
                  }}
                   onBlur={() => setSearchMode(false)}
                   />
                   </div>
                   ) : (
                   <button
                   style={{
                  backgroundColor: '#4f4f4f',
                  color: '#ffffffbd',
                  border: 'none',
                  padding: '0.75rem',
                  flex: searchMode ? 3 : 1,
                  minWidth: '50px',
                  borderRadius: '8px',
                  cursor: 'text',
                  transition: 'flex 0.25s ease',
                  marginRight: '1rem',
                }}
                  onClick={() => setSearchMode(true)}
                  >🔍
                  </button>
                )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <History 
                  username={username}
                  isOpen={isOpen}
                  refreshHistory={refreshHistory}
                  searchQuery={searchQuery}
                  onSelectConversation={async (id) => {
                    try {
                      const res = await fetch(`http://localhost:3001/api/conversation/${id}`);
                      const raw = await res.json();
                      const cleanedMessages = raw
                      .slice(1)
                      .map(msg => ({
                        role: msg.role,
                        content: msg.content
                      }));
                      onOpenChat({
                        messages: cleanedMessages,
                        conversationId: id
                      });
                      onClose();
                    } catch (err) {
                      console.error("Failed to load conversation", err);
                    }}}
                    /></div>
          </>
        )}
     </div>
    </>
  );
};

export default FlyoutPanel;