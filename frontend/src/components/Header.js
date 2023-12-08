// Header.js
import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import logo from '../images/logo.png';
import './Header.css';
import './Header_modals.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

function Header({ updateLoginStatus }) {
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;
  const [currentUser, setCurrentUser] = useState('Not logged in');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState({ name: '', surname: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpError, setSignUpError] = useState('');
  const [loginError, setLoginError] = useState('');

  // Handle change for sign-up and login forms
  const handleChange = (e, formType) => {
    if (formType === 'signup') {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    } else {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }
  };

  // Function to check if the user is logged in
  const isLoggedIn = () => currentUser !== 'Not logged in'; //not sure how to translate as the state should be able to be user. Thus have to leave as text string 'Not logged in' instead of using text.headerCurrentuserstatus

  const isPasswordComplex = (password) => {
    const hasMinLength = password.length >= 8;
    const hasCapitalLetter = /[A-Z]/.test(password);
    return hasMinLength && hasCapitalLetter;
  };

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:5000/verify_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        updateLoginStatus(true, data.user_id); // Update login status in App.js
      } else {
        updateLoginStatus(false, null); // Reset login status in App.js
        // Handle token verification failure
      }
    } catch (error) {
      console.error('Error:', error);
      updateLoginStatus(false, null);
      // Handle server error
    }
  }, [updateLoginStatus]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, [verifyToken]);

  // Handle user sign-up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordComplex(userData.password)) {
      setSignUpError(text.headerModalSignuppasswordError);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/create_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      setUserData({ name: '', surname: '', email: '', password: '' });
      setShowSignUp(false);
      setSignUpError('');
    } catch (error) {
      console.error('Error:', error);
      setSignUpError(text.headerModalSignupError);
    }
  };

  // Handle user login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        updateLoginStatus(true, data.user_id); // Pass user ID to App.js
        setShowLogin(false);
      } else {
        //setLoginError('');
        setLoginError(data.error || text.headerModalLoginError);
      }
      setLoginData({ email: '', password: '' });
    } catch (error) {
      console.error('Error:', error);
      setLoginError(text.headerModalLoginError);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(text.headerCurrentuserstatus);
    // Any other logout logic
  };

  // Clear errors when the modals are closed
  const closeModal = (modalType) => {
    if (modalType === 'signUp') {
      setShowSignUp(false);
      setSignUpError(''); // Clear sign-up error
    } else if (modalType === 'login') {
      setShowLogin(false);
      setLoginError(''); // Clear login error
    }
  };
  
  return (
    <div className="header">
      <img src={logo} alt="Logo" className="header-logo" />
      <div className="header-right">
        <div className="user-display"> {text.headerCurrentuser} {currentUser}</div>
        <div className="button-group">
        <button className="header-button" onClick={() => setShowSignUp(true)}>{text.headerSignup}</button>
          {isLoggedIn() ? (
            <button className="header-button" onClick={handleLogout}>{text.headerLogout}</button>
          ) : (
            <button className="header-button" onClick={() => setShowLogin(true)}>{text.headerLogin}</button>
          )}
        </div>
      </div>
      {/* Sign-Up Modal */}
      <Modal className="modal" isOpen={showSignUp} onRequestClose={() => closeModal('signUp')}>
        <h2>{text.headerModalSignuptitle}</h2>
        <form onSubmit={handleSignUpSubmit}>
          <input type="text" name="name" placeholder={text.headerModalName} onChange={(e) => handleChange(e, 'signup')} value={userData.name} />
          <input type="text" name="surname" placeholder={text.headerModalSurname} onChange={(e) => handleChange(e, 'signup')} value={userData.surname} />
          <input type="email" name="email" placeholder={text.headerModalEmail} onChange={(e) => handleChange(e, 'signup')} value={userData.email} />
          <input type="password" name="password" placeholder={text.headerModalPassword} onChange={(e) => handleChange(e, 'signup')} value={userData.password} />
          <button type="submit">{text.headerModalCreateuserButton}</button>
        </form>
        <button onClick={() => setShowSignUp(false)}>{text.globalCloseButton}</button>
        {signUpError && <p>{signUpError}</p>}
      </Modal>

      {/* Login Modal */}
      <Modal className="modal" isOpen={showLogin} onRequestClose={() => closeModal('login')}>
        <h2>{text.headerModalLogintitle}</h2>
        <form onSubmit={handleLoginSubmit}>
          <input type="email" name="email" placeholder={text.headerModalEmail} onChange={(e) => handleChange(e, 'login')} value={loginData.email} />
          <input type="password" name="password" placeholder={text.headerModalPassword} onChange={(e) => handleChange(e, 'login')} value={loginData.password} />
          <button type="submit">{text.headerModalLoginButton}</button>
        </form>
        <button onClick={() => setShowLogin(false)}>{text.globalCloseButton}</button>
        {loginError && <p>{loginError}</p>}
      </Modal>

    </div>
  );
}

export default Header;