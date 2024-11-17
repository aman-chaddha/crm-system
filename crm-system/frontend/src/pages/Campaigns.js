
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateCampaign = () => {
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('pending');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [audiences, setAudiences] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState('');
  const [messageStatus, setMessageStatus] = useState('');

  // Fetch the list of audiences when the component loads
  useEffect(() => {
    const fetchAudiences = async () => {
      try {
        const response = await axios.get('http://localhost:5000/audiences');
        setAudiences(response.data);
      } catch (error) {
        console.error('Error fetching audiences:', error);
      }
    };

    fetchAudiences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDateISO = new Date(startDate).toISOString();
    const endDateISO = new Date(endDate).toISOString();

    const campaignData = {
      name: campaignName,
      message,
      status,
      startDate: startDateISO,
      endDate: endDateISO,
      audienceId: selectedAudience, 
    };

    try {
      const response = await axios.post('http://localhost:5000/campaigns', campaignData);
      setMessageStatus('Campaign created successfully!');
      console.log('Campaign created:', response.data);
    } catch (error) {
      setMessageStatus('Failed to create campaign.');
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <div>
      <h1>Create Campaign</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
          </select>
        </div>

        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Target Audience:</label>
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            required
          >
            <option value="">Select Audience</option>
            {audiences.map((audience) => (
              <option key={audience._id} value={audience._id}>
                {audience.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create Campaign</button>
      </form>

      {messageStatus && <p>{messageStatus}</p>}
    </div>
  );
};

export default CreateCampaign;
