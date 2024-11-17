require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const sendMessageRoute = require('./routes/sendMessage');
const communicationsRoutes = require('./routes/communicationsRoutes');
const deliveryReceiptRoutes = require('./routes/deliveryReceipt');
const customerRoutes = require('./routes/customerRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');
const passportConfig = require('./config/passport'); 
require('./config/db');
const app = express();
const url = process.env.MONGO_URI || 'mongodb://localhost:27017'; 
const dbName = process.env.DB_NAME || 'crm-system'; 

let db, customersCollection, ordersCollection, audiencesCollection, campaignsCollection, communicationsLogCollection;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-session-secret', 
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    customersCollection = db.collection('customers');
    ordersCollection = db.collection('orders');
    audiencesCollection = db.collection('audiences');
    campaignsCollection = db.collection('campaigns');
    communicationsLogCollection = db.collection('communications_log'); 
    app.use('/auth', authRoutes); 
    app.use('/customers', customerRoutes);
    app.use('/api/audiences', audienceRoutes);
    app.use('/communications', communicationsRoutes);
    app.use('/api/audiences', sendMessageRoute);
    app.use('/delivery-receipt', deliveryReceiptRoutes);
    app.use('/campaigns', campaignRoutes); 
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if connection fails
  });

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);



app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard or home
    res.redirect('http://localhost:3000/');
  }
);

// Route to log out
app.get('/logout', (req, res) => {
  req.logout((err) => {
    res.redirect('/');
  });
});

// --- Helper function to build MongoDB query ---
function buildMongoQuery(conditions) {
  const query = {};
  const logic = conditions.logic === 'AND' ? '$and' : '$or';
  query[logic] = conditions.rules.map((rule) => {
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
    let value = rule.value;

    if (!isNaN(value)) {
      value = parseFloat(value); // Convert string numbers to actual numbers
    }

    return { [field]: { [mongoOperator]: value } };
  });
  return query;
}

// --- Customers Routes ---
app.get('/customers', async (req, res) => {
  try {
    const customers = await customersCollection.find({}).toArray();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

app.post('/customers', async (req, res) => {
  try {
    const newCustomer = req.body;
    const result = await customersCollection.insertOne(newCustomer);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Error adding customer' });
  }
});

// --- Orders Routes ---
app.get('/orders', async (req, res) => {
  try {
    const orders = await ordersCollection.find({}).toArray();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const newOrder = req.body;
    const result = await ordersCollection.insertOne(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ message: 'Error adding order' });
  }
});

// --- Audiences Routes ---
app.get('/audiences', async (req, res) => {
  try {
    const audiences = await audiencesCollection.find({}).toArray();
    res.json(audiences);
  } catch (error) {
    console.error('Error fetching audiences:', error);
    res.status(500).json({ message: 'Error fetching audiences' });
  }
});

app.post('/audiences/create', async (req, res) => {
  try {
    const { name, conditions } = req.body;

    if (!name || !conditions) {
      return res.status(400).json({ message: 'Both name and conditions are required.' });
    }

    console.log('Creating audience with data:', req.body);

    const query = buildMongoQuery(conditions);
    console.log('Generated MongoDB query:', query);

    const audienceSize = await customersCollection.countDocuments(query);

    const newAudience = {
      name,
      conditions,
      query,
      size: audienceSize,
      createdAt: new Date(),
    };

    const result = await audiencesCollection.insertOne(newAudience);

    res.status(201).json({
      message: 'Audience created successfully',
      audience: newAudience,
    });
  } catch (error) {
    console.error('Error creating audience:', error);
    res.status(500).json({
      message: 'Error creating audience',
      error: error.message || 'Unknown error',
    });
  }
});

// --- Campaign Routes ---
app.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await campaignsCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
});

app.post('/campaigns', async (req, res) => {
  try {
    const { name, status, targetAudience, startDate, endDate, message } = req.body;
    if (!name || !status || !targetAudience || !startDate || !endDate || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newCampaign = {
      name,
      status,
      targetAudience,
      startDate,
      endDate,
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await campaignsCollection.insertOne(newCampaign);

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaign,
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Error creating campaign' });
  }
});
