import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateAudience from './pages/CreateAudience'; 
import Home from './pages/HomePage'; 
import CampaignHistory from './pages/CampaignHistory'; 
import LoginPage from './components/LoginPage'; 

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize state for authentication

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/'; 
    }
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    // Show a loading state until the authentication check is completed
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/campaign-history/:audienceId" 
          element={isAuthenticated ? <CampaignHistory /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create-audience" 
          element={isAuthenticated ? <CreateAudience /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};
export default App;


