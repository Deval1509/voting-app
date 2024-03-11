import React, { useState } from 'react';import './App.css';
import BarciIcon from './logo/barci-Icon.svg';
import SignUpForm from './components-js/SignUpForm';
import LoginForm from './components-js/LoginForm';
import HomePage from './HomePage'; 



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  // useEffect(() => {
  //   const Keycloak = keycloak(); 
  //   Keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
  //     setIsLoggedIn(authenticated); // Update the isLoggedIn state based on authentication result
  //   });
  // }, []);

  const handleAlreadySignedUp = () => {
    setShowSignUpForm(false); 
    setShowLoginForm(true);
  };

  // Define the handleLoginSuccess function
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); 
  };

  return (
    <div className="App">
      <img src={BarciIcon} alt="Barci Icon" className="icon" />
      <span className="Title_slant__1eM4c">Greenwich - Cutty Sark</span>
      {isLoggedIn ? (
        <HomePage />
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
