import React, { useState } from 'react';
import '../components-css/LoginForm.css';

const LoginForm = () => {
  // State variables to store the username, password, and password visibility
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Event handlers to update the state when inputs change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can perform actions like sending login credentials to a server
    console.log('Submitting login with:', { username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username" className="form-label">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
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
      <button type="submit" className="submit-button">Login</button>
    </form>
  );
};

export default LoginForm;
