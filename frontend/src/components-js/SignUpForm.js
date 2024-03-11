import React, { useState } from 'react';
import '../components-css/SignUpForm.css';


const SignUpForm = ({ handleAlreadySignedUp }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting signup form:', { username, email, password });
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginClick = () => {
    handleAlreadySignedUp();
  };

  return (
    <form onSubmit={handleSubmit} className="sign-up-form">
      <div className="form-group">
        <label htmlFor="username" className="form-label">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group password-input-container">
        <label htmlFor="password" className="form-label">Password:</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      <button type="submit" className="submit-button">Sign Up</button>
      <p>Already have an account? <button type="button" onClick={handleLoginClick} className="login-button">Log in</button></p>
    </form>
  );
};

export default SignUpForm;
