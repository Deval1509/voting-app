import React, { useState } from 'react';
import axios from 'axios';
import '../components-css/LoginForm.css';

const LoginForm = ({ handleLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login with:', { identifier, password });
    try {
      const response = await axios.post('http://localhost:5000/login', {
        identifier,
        password,
      });
      const { token } = response.data;
      console.log('Login successful:', token);
      handleLoginSuccess(token);
      setIdentifier('');
      setPassword('');
      setError('');
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
      setError('Invalid username/email or password');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="identifier" className="form-label">Username or Email:</label>
        <input
          type="text"
          id="identifier"
          value={identifier}
          onChange={handleIdentifierChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password:</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="form-input"
            required
          />
          <button
            type="button"
            className={`view-password-button ${showPassword ? 'hide' : 'show-eye'}`}
            onClick={togglePasswordVisibility}
            style={{ display: 'inline-block' }}
          ></button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="submit-button">Login</button>
    </form>
  );
};

export default LoginForm;
