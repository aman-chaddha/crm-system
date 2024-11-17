import React, { useState } from 'react';

const CreateAudience = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [spending, setSpending] = useState('');
  const [visits, setVisits] = useState('');
  const [segment, setSegment] = useState('');
  const [message, setMessage] = useState('');
  const determineSegment = () => {
    const spendingValue = parseFloat(spending);
    const visitsValue = parseInt(visits, 10);

    if (spendingValue >= 20000 && visitsValue >= 10) {
      setSegment('VIP Customers');
      setMessage('Customers with spending >= INR 20,000 and visits >= 10.');
    } else if (spendingValue >= 15000 && visitsValue >= 5) {
      setSegment('Loyal High Spenders');
      setMessage('Customers with spending >= INR 15,000 and visits >= 5.');
    } else if (spendingValue >= 10000 && visitsValue >= 3) {
      setSegment('AA Rated Customers');
      setMessage('Customers with spending >= INR 10,000 and visits >= 3.');
    } else if (spendingValue >= 10000) {
      setSegment('High Spenders (A Rated)');
      setMessage('Customers with total spending >= INR 10,000.');
    } else if (spendingValue >= 5000 && visitsValue >= 3) {
      setSegment('Regular Customers');
      setMessage('Customers with spending between INR 5,000-10,000 and visits >= 3.');
    } else if (spendingValue >= 5000) {
      setSegment('A Rated Customers');
      setMessage('Customers with spending between INR 5,000-10,000.');
    } else if (spendingValue < 5000 && visitsValue >= 5) {
      setSegment('Frequent Visitors');
      setMessage('Customers with spending < INR 5,000 but visits >= 5.');
    } else if (spendingValue < 5000 && visitsValue === 0) {
      setSegment('Dormant Customers');
      setMessage('Customers who haven’t visited in the last 3 months.');
    } else {
      setSegment('General Customers');
      setMessage('Customers who do not meet any specific criteria.');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !spending || !visits) {
      alert('Please fill in all fields.');
      return;
    }

    determineSegment();
    const segmentData = {
      name,
      email,
      segment,
      conditions: {
        logic: 'AND',
        rules: [
          { field: 'spending', operator: '>=', value: spending },
          { field: 'visits', operator: '>=', value: visits },
        ],
      },
    };
    try {
      const response = await fetch('http://localhost:5000/audiences/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(segmentData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Audience created successfully!');
        console.log('Audience created:', result);
      } else {
        alert(`Failed to create audience: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating audience.');
    }
    const customerData = { name, email };

    try {
      const response = await fetch('http://localhost:5000/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Customer added:', result);
      } else {
        alert(`Failed to add customer: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding customer.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create Audience</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter customer name"
            style={{ margin: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter customer email"
            style={{ margin: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Total Spending (INR):</label>
          <input
            type="number"
            value={spending}
            onChange={(e) => setSpending(e.target.value)}
            placeholder="Enter total spending"
            style={{ margin: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Number of Visits:</label>
          <input
            type="number"
            value={visits}
            onChange={(e) => setVisits(e.target.value)}
            placeholder="Enter number of visits"
            style={{ margin: '10px', padding: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: 'cyan', border: 'none', cursor: 'pointer' }}>
          Determine Segment
        </button>
      </form>

      {segment && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Segment: {segment}</h3>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default CreateAudience;
