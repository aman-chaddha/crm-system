import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/campaigns')
      .then((response) => {
        setCampaigns(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Past Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign._id}>
            <h3>{campaign.name}</h3>
            <p><strong>Created At:</strong> {new Date(campaign.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {campaign.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignHistory;
