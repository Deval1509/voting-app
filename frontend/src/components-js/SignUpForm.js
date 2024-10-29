import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
    const newUser = { id: uuidv4(), username, email, password };  // Create a new user object
    try {
      // Retrieve the current array of users or initialize it if not present
      const users = JSON.parse(localStorage.getItem('users')) || [];
  
      // Check if the user already exists based on username or email
      const exists = users.some(user => user.username === username || user.email === email);
      if (exists) {
        setError('Username or email already exists');
        setSuccess('');
        return; // Stop the function if the user already exists
      }
  
      // Add the new user to the array
      users.push(newUser);
      
      // Store the updated array back into local storage
      localStorage.setItem('users', JSON.stringify(users));

      // Call handleNewUser to add the new user as a candidate
      handleNewUser(newUser);
  
      // Reset form fields and set success message
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

  // Function to add a new user as a candidate
  const handleNewUser = (newUser) => {
    // Fetch existing candidates from localStorage
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    
    // Check if the new user is already a candidate; if not, add them
    const userAlreadyCandidate = candidates.some(candidate => candidate.username === newUser.username);
    
    if (!userAlreadyCandidate) {
      candidates.push({
        id: newUser.id,
        username: newUser.username,
        votes: 0,
      });
    }
    
    // Save updated candidates back to localStorage
    localStorage.setItem('candidates', JSON.stringify(candidates));
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
