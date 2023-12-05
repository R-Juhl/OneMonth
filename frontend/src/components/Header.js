import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import logo from '../images/logo.png';
import './Header.css';
import './Modals.css';

Modal.setAppElement('#root');

function Header() {
  const [currentUser, setCurrentUser] = useState("Not logged in");
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState({ name: '', surname: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  // Handle change for sign-up and login forms
  const handleChange = (e, formType) => {
    if (formType === 'signup') {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    } else {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }
  };

  // Function to check if the user is logged in
  const isLoggedIn = () => currentUser !== "Not logged in";

  const isPasswordComplex = (password) => {
    const hasMinLength = password.length >= 8;
    const hasCapitalLetter = /[A-Z]/.test(password);
    return hasMinLength && hasCapitalLetter;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/verify_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
      } else {
        // Handle token verification failure
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle server error
    }
  };

  // Handle user sign-up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordComplex(userData.password)) {
      setMessage('Password must be at least 8 characters long and contain at least one capital letter.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/create_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      setMessage(data.message);
      setUserData({ name: '', surname: '', email: '', password: '' });
      setShowSignUp(false);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to create user.');
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
        setShowLogin(false);
      } else {
        setMessage(data.error);
      }
      setLoginData({ email: '', password: '' });
    } catch (error) {
      console.error('Error:', error);
      setMessage('Login failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser("Not logged in");
    // Any other logout logic
  };
  
  return (
    <div className="header">
      <img src={logo} alt="Logo" className="header-logo" />
      <div>Current user: {currentUser}</div>
      <button className="header-button" onClick={() => setShowSignUp(true)}>Sign up</button>
        {isLoggedIn() ? (
          <button className="header-button" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="header-button" onClick={() => setShowLogin(true)}>Log in</button>
        )}

      {/* Sign-Up Modal */}
      <Modal className="modal" isOpen={showSignUp} onRequestClose={() => setShowSignUp(false)}>
        <h2>Register</h2>
        <form onSubmit={handleSignUpSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={(e) => handleChange(e, 'signup')} value={userData.name} />
          <input type="text" name="surname" placeholder="Surname" onChange={(e) => handleChange(e, 'signup')} value={userData.surname} />
          <input type="email" name="email" placeholder="Email" onChange={(e) => handleChange(e, 'signup')} value={userData.email} />
          <input type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e, 'signup')} value={userData.password} />
          <button type="submit">Create User</button>
        </form>
        <button onClick={() => setShowLogin(false)}>Close</button>
        {message && <p>{message}</p>}
      </Modal>

      {/* Login Modal */}
      <Modal className="modal" isOpen={showLogin} onRequestClose={() => setShowLogin(false)}>
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={(e) => handleChange(e, 'login')} value={loginData.email} />
          <input type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e, 'login')} value={loginData.password} />
          <button type="submit">Login</button>
        </form>
        <button onClick={() => setShowLogin(false)}>Close</button>
        {message && <p>{message}</p>}
      </Modal>

    </div>
  );
}

export default Header;