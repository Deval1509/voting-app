import React, { useState } from 'react';
import axios from 'axios';
import '../components-css/SignUpForm.css';

const SignUpForm = ({ handleAlreadySignedUp }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password,
      });
      console.log('User registered:', response.data);
      setUsername('');
      setEmail('');
      setPassword('');
      setSuccess('User registered successfully');
      setError('');
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Failed to register user');
      setSuccess('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="sign-up-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      
      <div className="form-group">
        <label htmlFor="username" className="form-label">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Your first Name"
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
          placeholder="Your email"
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
            placeholder="Your password"
            required
          />
          <button
            type="button"
            className={`view-password-button ${showPassword ? 'hide' : 'show-eye'}`}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          />
        </div>
      </div>
      
      {/* Display error or success messages */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <button type="submit" className="submit-button">Sign Up</button>

      <p>Already have an account? <button type="button" onClick={handleAlreadySignedUp} className="login-button">Log in</button></p>
    </form>
  );
};

export default SignUpForm;
