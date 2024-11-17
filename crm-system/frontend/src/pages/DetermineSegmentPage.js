import React, { useState } from "react";

const DetermineSegmentPage = () => {
  const [customerData, setCustomerData] = useState({
    spending: "",
    visits: "",
    lastVisit: "",
  });
  const [segment, setSegment] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const determineSegment = () => {
    const spendingValue = parseFloat(customerData.spending);
    const visitsValue = parseInt(customerData.visits, 10);

    if (isNaN(spendingValue) || isNaN(visitsValue)) {
        setError('Please enter valid numbers for spending and visits');
        return;
      }
    setSegment("");
    setMessage("");

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

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Determine Customer Segment</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Spending (INR):{" "}
          <input
            type="number"
            name="spending"
            value={customerData.spending}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Visits:{" "}
          <input
            type="number"
            name="visits"
            value={customerData.visits}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Last Visit Date:{" "}
          <input
            type="date"
            name="lastVisit"
            value={customerData.lastVisit}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <button
        onClick={determineSegment}
        style={{
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Determine Segment
      </button>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {segment && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Matching Segment:</h3>
          <p>
            <strong>{segment}:</strong> {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetermineSegmentPage;
