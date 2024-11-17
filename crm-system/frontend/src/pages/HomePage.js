import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
    }
  }, [navigate]);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/campaigns', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load past campaigns. Please try again.');
    }
  };

  const handleShowCampaigns = () => {
    fetchCampaigns();
    setShowCampaigns(true);
  };

  return (
    <div className="homepage-container">
      <h1 className="heading">Welcome to CRM System</h1>
      <hr className="divider" />
      <div className="button-container">
        <Link to="/create-audience" className="custom-button">
          Go to Create Audience
        </Link>
        <button onClick={handleShowCampaigns} className="custom-button">
          Show Past Campaigns
        </button>
      </div>

      {showCampaigns && (
        <div>
          <h2>Past Campaigns</h2>
          {error && <p>{error}</p>}
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div key={campaign._id} className="campaign-card">
                <h3>Campaign Name: {campaign.name}</h3>
                <p><strong>Audience:</strong> {campaign.audience}</p>
                <p><strong>Message:</strong> {campaign.message}</p>
                <p><strong>Date Sent:</strong> {new Date(campaign.dateSent).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No past campaigns found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;

