import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AudienceTable = () => {
  const [audiences, setAudiences] = useState([]);

  useEffect(() => {
    const fetchAudiences = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/audiences');
        setAudiences(response.data);
      } catch (error) {
        console.error('Error fetching audiences:', error);
      }
    };

    fetchAudiences();
  }, []);

  return (
    <div>
      <h2>Audience List</h2>
      <table>
        <thead>
          <tr>
            <th>Audience Name</th>
            <th>Conditions</th>
            <th>Audience Size</th>
          </tr>
        </thead>
        <tbody>
          {audiences.map((audience) => (
            <tr key={audience._id}>
              <td>{audience.name}</td>
              <td>
                {audience.conditions.map((condition, index) => (
                  <div key={index}>
                    {condition.field} {condition.operator} {condition.value}
                  </div>
                ))}
              </td>
              <td>{audience.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AudienceTable;
