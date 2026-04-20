import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <h1>Welcome to Meka</h1>
            <p className="subhead">
                Meka provides a clean interface for an LLM.  
                Create an account and start chatting.
            </p>
            <button className="cta-button">Get Started</button>
        </section>
    )
}

export default Hero;