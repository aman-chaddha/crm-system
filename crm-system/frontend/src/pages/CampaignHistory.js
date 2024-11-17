import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { audienceId } = useParams(); 

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (!audienceId) {
          setMessage('Audience ID is missing.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/campaigns/audience/${audienceId}`
        );
        setCampaigns(response.data);
        setMessage('');
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setMessage('Failed to fetch campaign history.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [audienceId]);

  return (
    <div>
      <h1>Campaign History</h1>
      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <>
          {message && <p>{message}</p>}
          {campaigns.length === 0 && !message ? (
            <p>No campaigns found for this audience.</p>
          ) : (
            <table style={{ border: '1px solid black', width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Campaign Name</th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Created At</th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign._id}>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{campaign.name}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{campaign.status}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      {new Date(campaign.createdAt).toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{campaign.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default CampaignHistory;
