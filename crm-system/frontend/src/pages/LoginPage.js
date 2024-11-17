import React from 'react';

const LoginPage = () => {
const handleLogin = () => {
  window.location.href = 'http://localhost:5000/auth/google';
};

useEffect(() => {
  const token = new URLSearchParams(window.location.search).get('token');
  if (token) {
    localStorage.setItem('token', token);
    window.location.href = '/'; 
  }
}, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Campaign Manager</h1>
      <p>Please log in using your Google account to access the application.</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
