import React from 'react';

const AccountIcon = ({ isLoggedIn, onLogout, onLoginClick }) => {
  if (isLoggedIn) {
    return (
      <div className = "account-info">
        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="account-icon">
      <button onClick={onLoginClick}>👤 Login</button>
    </div>
  );
};

export default AccountIcon;