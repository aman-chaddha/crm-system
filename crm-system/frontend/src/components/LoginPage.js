// src/components/LoginPage.js
import React from 'react';
import './LoginPage.css'; 

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="login-page">
      <h1>Login to CRM System</h1>
      <button onClick={handleLogin} className="login-button">
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
