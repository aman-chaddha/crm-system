const express = require('express');
const { MongoClient } = require('mongodb');
const CommunicationsLog = require('../models/CommunicationsLog');  // Import the communications log model
const router = express.Router();
const url = 'mongodb://localhost:27017';
const dbName = 'crm-system';

let db, audiencesCollection, customersCollection;
async function connectToDb() {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    audiencesCollection = db.collection('audiences');
    customersCollection = db.collection('customers');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDb();
function buildMongoQuery(conditions) {
  const query = { $and: [] };

  conditions.rules.forEach((rule) => {
    const field = rule.field;
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
      '!=': '$ne',
    };

    const mongoOperator = operatorMap[rule.operator];
    query.$and.push({ [field]: { [mongoOperator]: rule.value } });
  });

  return query;
}
function determineSegment(rules) {
  let spendingValue = null;
  let visitsValue = null;
  rules.forEach(rule => {
    if (rule.field === 'spending') {
      spendingValue = parseFloat(rule.value);  
    } else if (rule.field === 'visits') {
      visitsValue = parseInt(rule.value, 10);  
    }
  });
  if (spendingValue == null || visitsValue == null) {
    return 'Invalid Segment'; 
  }

  if (spendingValue >= 20000 && visitsValue >= 10) {
    return 'VIP Customers';
  } else if (spendingValue >= 15000 && visitsValue >= 5) {
    return 'Loyal High Spenders';
  } else if (spendingValue >= 10000 && visitsValue >= 3) {
    return 'AA Rated Customers';
  } else if (spendingValue >= 10000) {
    return 'High Spenders (A Rated)';
  } else if (spendingValue >= 5000 && visitsValue >= 3) {
    return 'Regular Customers';
  } else if (spendingValue >= 5000) {
    return 'A Rated Customers';
  } else if (spendingValue < 5000 && visitsValue >= 5) {
    return 'Frequent Visitors';
  } else if (spendingValue < 5000 && visitsValue === 0) {
    return 'Dormant Customers';
  } else {
    return 'General Customers'; 
  }
}
router.post('/create', async (req, res) => {
  try {
    const { name, email, conditions } = req.body;

    if (!name || !email || !conditions) {
      return res.status(400).json({ message: 'Name, email, and conditions are required.' });
    }
    if (!Array.isArray(conditions.rules)) {
      return res.status(400).json({ message: 'Conditions should be an array of rules' });
    }
    const query = buildMongoQuery(conditions);
    console.log('Generated MongoDB query:', query);
    const audienceSize = await customersCollection.countDocuments(query);
    const audienceName = determineSegment(conditions.rules);
    conditions.rules.forEach(rule => {
      if (rule.field === 'spending') {
        rule.value = parseFloat(rule.value);  
      } else if (rule.field === 'visits') {
        rule.value = parseInt(rule.value, 10);  
      }
    });
    const newAudience = {
      name,
      email,
      conditions,
      query,
      size: audienceSize,
      createdAt: new Date(),
    };
    await audiencesCollection.insertOne(newAudience)
      .then(async () => {
        const messageData = {
          name,
          email,
          segment: audienceName,
          message: 'Hi ${name}, welcome to our special segment!'  
        };
        const newLog = new CommunicationsLog({
          name: messageData.name,
          email: messageData.email,
          segment: messageData.segment,
          message: messageData.message,
          date: new Date(),
        });

        await newLog.save();

        res.status(201).json({
          message: 'Audience created and communication logged successfully',
          audience: newAudience,
          communicationLog: newLog,
        });
      })
      .catch((error) => {
        console.error('Error inserting audience:', error);
        res.status(500).json({ message: 'Error creating audience', error: error.message });
      });
  } catch (error) {
    console.error('Error creating audience:', error);
    res.status(500).json({ message: 'Error creating audience', error: error.message });
  }
});

router.post('/send-personalized-message', async (req, res) => {
  console.log('send-personalized-message route hit');
  try {
    // Fetch the audience segment from the audiences collection
    const audience = await audiencesCollection.findOne({ name: req.body.segmentName });
    
    if (!audience) {
      return res.status(404).json({ message: 'Audience segment not found.' });
    }

    // Build MongoDB query based on the audience's conditions
    const query = buildMongoQuery(audience.conditions);
    
    // Fetch customers matching the segment conditions
    const customers = await customersCollection.find(query).toArray();

    // Loop through each customer and send a personalized message
    for (const customer of customers) {
      const message = `Hi ${customer.name}, here’s 10% off on your next order!`;

      // Save the communication in communications_log collection
      const newLog = new CommunicationsLog({
        name: customer.name,
        email: customer.email,
        segment: audience.name,
        message: message,
        date: new Date(),
      });

      // Save the log in the database
      await newLog.save();
      console.log(`Message sent to ${customer.name}`);
    }

    res.status(200).json({ message: 'Messages sent successfully!' });
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).json({ message: 'Error sending personalized messages.' });
  }
});


module.exports = router;