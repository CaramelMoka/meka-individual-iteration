import React from 'react';

const Greeting = ({ username }) => {
  const hour = new Date().getHours();
  let greeting = 'Hello'; 
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  const displayName = username || 'User'

  return <h2 className="greeting">{greeting}, {displayName}</h2>;
};

export default Greeting;