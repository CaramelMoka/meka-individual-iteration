import React from 'react';

const HamburgerMenu = ({ onClick }) => {
  return (
    <button className="hamburger-button" onClick={onClick}>
      ☰
    </button>
  );
};

export default HamburgerMenu;