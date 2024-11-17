const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let customersCollection, audiencesCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('campaign_management');
    customersCollection = db.collection('customers');
    audiencesCollection = db.collection('audiences');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
}

connectDB();

module.exports = { customersCollection, audiencesCollection };
