import React, { useState } from 'react';
import './App.css';
import BarciIcon from './logo/barci-Icon.svg';
import SignUpForm from './components-js/SignUpForm';
import LoginForm from './components-js/LoginForm';
import VoteForm from './components-js/VoteForm'; // Import the VoteForm component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleAlreadySignedUp = () => {
    setShowSignUpForm(false);
    setShowLoginForm(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <img src={BarciIcon} alt="Barci Icon" className="icon" />
      <span className="Title_slant__1eM4c">Greenwich - Cutty Sark</span>
      {isLoggedIn ? (
        <VoteForm userId="123" /> // Pass the userId or other necessary props
      ) : (
        <>
          {showSignUpForm ? (
            <SignUpForm handleAlreadySignedUp={handleAlreadySignedUp} />
          ) : (
            <>
              {showLoginForm ? (
                <LoginForm handleLoginSuccess={handleLoginSuccess} />
              ) : (
                <h1 onClick={() => setShowSignUpForm(true)} className="sign-up-link">Sign Up</h1>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
