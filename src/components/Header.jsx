import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="app-header">
            <div className="logo">Meka</div>
            <nav>
                <a href="/login">Login</a>
                <a href="/signup">Signup</a>
            </nav>
        </header>
    )
}

export default Header;