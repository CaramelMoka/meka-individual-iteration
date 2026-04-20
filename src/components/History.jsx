import React, { useEffect, useState } from 'react';
// lint

const Section = ({
  title,
  items,
  sectionKey,
  isOpen,
  toggle,
  onSelectConversation,
}) => {
const [activeId, setActiveId] = useState(null);
const [hoverId, setHoverId] = useState(null);
const formatDate = (dateStr) => {
const date = new Date(dateStr);
const now = new Date();
const diff = (now - date) / (1000 * 60 * 60 * 24);

  if (diff < 1) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diff < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString();
  }
};
  
  if (!items || items.length === 0) return null;

  return (
    <div style={{ marginBottom: '1rem' }}>
      
      {/* title,able to fold */}
      <div
        onClick={() => toggle(sectionKey)}
        style={{
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {title}
        <span>{isOpen ? '▼' : '▶'}</span>
      </div>

      {/* content */}
{isOpen && items.map(msg => (
  <div
    key={msg.id}

    onClick={() => {
      setActiveId(msg.id);
      onSelectConversation && onSelectConversation(msg.id);
    }}

    onMouseEnter={() => setHoverId(msg.id)}
    onMouseLeave={() => setHoverId(null)}

    style={{
      padding: '0.4rem 0.6rem',
      cursor: 'pointer',
      borderRadius: '6px',
      transition: 'background 0.2s ease',

      display: 'flex',                 
      justifyContent: 'space-between', 
      alignItems: 'center',

      backgroundColor:
        activeId === msg.id
          ? '#45475a'
          : hoverId === msg.id
          ? '#3a3a3a'
          : 'transparent'
    }}
  >
    {/* title */}
    <span
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {msg.title}
    </span>

    {/* Date */}
    <span
      style={{
        fontSize: '0.75rem',
        opacity: hoverId === msg.id ? 0.9 : 0.6,
        marginLeft: '0.5rem',
        flexShrink: 0,
      }}
    >
      {formatDate(msg.created_at)}
    </span>
  </div>
))}
    </div>
  );
};


const History = ({ username, isOpen, refreshHistory, onSelectConversation,searchQuery }) => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const [openSections, setOpenSections] = useState({
    today: true,
    yesterday: true,
    week: true,
    month: true,
    older: true
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const groupHistory = (history) => {
    const groups = {
      today: [],
      yesterday: [],
      week: [],
      month: [],
      older: []
    };

    const now = new Date();

    history.forEach(item => {
      const created = new Date(item.created_at);
      const diff = (now - created) / (1000 * 60 * 60 * 24);

      if (diff < 1) groups.today.push(item);
      else if (diff < 2) groups.yesterday.push(item);
      else if (diff < 7) groups.week.push(item);
      else if (diff < 30) groups.month.push(item);
      else groups.older.push(item);
    });

    return groups;
  };

useEffect(() => {
  if (!username || !isOpen) return;

  const url = searchQuery
    ? `http://localhost:3001/api/search?username=${username}&query=${searchQuery}`
    : `http://localhost:3001/api/history?username=${username}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setHistory(data);
        setError(null);
      } else {
        setError(data.error || "Unknown error");
        setHistory([]);
      }
    })
    .catch(() => {
      setError("Network error");
    });

}, [isOpen, username, refreshHistory, searchQuery]);

  if (!username) return <p>Please log in to view history.</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (history.length === 0) return <p>No chat history yet.</p>;


  const grouped = groupHistory(history);
  if (searchQuery && history.length === 0) {
  return <p style={{ opacity: 0.6 }}>No matching chats</p>;
}
  return (
  <>
    <style>
      {`
        .history-scroll {
          overflow-y: auto;
        }

.history-scroll::-webkit-scrollbar {
  width: 10px;
  background: transparent;
}
        .history-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .history-scroll::-webkit-scrollbar-thumb {
          background-color: #cba6f786;
          border-radius: 10px;
        }

        .history-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #cba6f7e5;
        }
      `}
    </style>

    <div className="history-scroll" style={{ 
      marginTop: '1rem',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
    paddingRight: '8px'
       }}>

      
      <Section
        title="Today"
        items={grouped.today}
        sectionKey="today"
        isOpen={openSections.today}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

      <Section
        title="Yesterday"
        items={grouped.yesterday}
        sectionKey="yesterday"
        isOpen={openSections.yesterday}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

      <Section
        title="Week"
        items={grouped.week}
        sectionKey="week"
        isOpen={openSections.week}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

      <Section
        title="Month"
        items={grouped.month}
        sectionKey="month"
        isOpen={openSections.month}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

      <Section
        title="Older"
        items={grouped.older}
        sectionKey="older"
        isOpen={openSections.older}
        toggle={toggleSection}
        onSelectConversation={onSelectConversation}
      />

    </div>
    </>
  );
};

export default History;