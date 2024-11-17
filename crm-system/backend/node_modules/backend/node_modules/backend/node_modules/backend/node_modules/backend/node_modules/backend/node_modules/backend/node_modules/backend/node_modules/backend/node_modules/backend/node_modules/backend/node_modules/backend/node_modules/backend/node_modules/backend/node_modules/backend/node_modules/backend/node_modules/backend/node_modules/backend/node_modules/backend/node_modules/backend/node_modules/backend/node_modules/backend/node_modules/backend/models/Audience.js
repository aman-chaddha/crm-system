const mongoose = require('mongoose');

// Define Audience schema
const audienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Segment name (e.g., VIP Customers, General Customers)
  },
  conditions: {
    type: Object,
    required: true, // The conditions used to define the audience segment
  },
  query: {
    type: Object,
    required: true, // MongoDB query built based on conditions
  },
  size: {
    type: Number,
    required: true, // The number of customers that match the conditions
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for when the audience was created
  }
});

// Create and export Audience model
const Audience = mongoose.model('Audience', audienceSchema);

module.exports = Audience;
