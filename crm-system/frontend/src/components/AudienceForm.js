import React, { useState } from 'react';
import axios from 'axios';

const AudienceForm = () => {
  const [audienceName, setAudienceName] = useState('');
  const [email, setEmail] = useState(''); 
  const [conditions, setConditions] = useState([{ field: '', operator: '', value: '' }]);
  const [logic, setLogic] = useState('AND');
  const [audienceSize, setAudienceSize] = useState(null);

  const handleConditionChange = (index, event) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][event.target.name] = event.target.value;
    setConditions(updatedConditions);
  };

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }]);
  };

  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const customerData = { name: audienceName, email };
    const audienceData = {
      name: audienceName,
      conditions,
      logic,
    };

    try {
      // Save customer data
      await axios.post('http://localhost:5000/customers', customerData);

      // Save audience data
      const response = await axios.post('http://localhost:5000/audiences/create', audienceData);
      setAudienceSize(response.data.audience.size); 
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div>
      <h2>Create Audience</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name</label>
          <input
            type="text"
            value={audienceName}
            onChange={(e) => setAudienceName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Customer Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Logic</label>
          <select value={logic} onChange={(e) => setLogic(e.target.value)}>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>

        {conditions.map((condition, index) => (
          <div key={index}>
            <div>
              <label>Field</label>
              <input
                type="text"
                name="field"
                value={condition.field}
                onChange={(e) => handleConditionChange(index, e)}
                placeholder="e.g. totalSpending"
                required
              />
            </div>
            <div>
              <label>Operator</label>
              <select
                name="operator"
                value={condition.operator}
                onChange={(e) => handleConditionChange(index, e)}
                required
              >
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value="=">=</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
                <option value="!=">≠</option>
              </select>
            </div>
            <div>
              <label>Value</label>
              <input
                type="text"
                name="value"
                value={condition.value}
                onChange={(e) => handleConditionChange(index, e)}
                placeholder="e.g. 10000"
                required
              />
            </div>
            <button type="button" onClick={() => removeCondition(index)}>
              Remove Condition
            </button>
          </div>
        ))}

        <button type="button" onClick={addCondition}>
          Add Condition
        </button>

        <div>
          {audienceSize !== null && <p>Audience Size: {audienceSize}</p>}
        </div>

        <button type="submit">Create Audience</button>
      </form>
    </div>
  );
};

export default AudienceForm;
