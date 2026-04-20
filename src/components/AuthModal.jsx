import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();//t('shows alert when help icon is clicked', () => {
      //  render(<FlyoutPanel isOpen={true} onClose={mockOnClose} isLoggedIn={false} />);
      //  fireEvent.click(screen.getByRole('button', { name: /\?/i }));
      //  expect(window.alert).toHaveBeenCalledWith('Help clicked');
      //});
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      
      alert('Account created! Please log in.');
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      
      onLoginSuccess(data); 
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Welcome to Meka</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <div className="modal-buttons">
            <button type="button" onClick={handleLogin} disabled={loading}>
              {loading ? 'Please wait...' : 'Log In'}
            </button>
            <button type="button" onClick={handleRegister} disabled={loading}>
              {loading ? 'Please wait...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AuthModal;
