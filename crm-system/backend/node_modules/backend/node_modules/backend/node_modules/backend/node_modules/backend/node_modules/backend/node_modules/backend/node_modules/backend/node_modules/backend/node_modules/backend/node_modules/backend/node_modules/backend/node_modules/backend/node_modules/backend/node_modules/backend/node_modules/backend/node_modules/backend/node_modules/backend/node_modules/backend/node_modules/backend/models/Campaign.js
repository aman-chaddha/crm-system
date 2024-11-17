const mongoose = require('mongoose');

// Define the schema for a campaign
const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Campaign name (required)
  audience: { type: mongoose.Schema.Types.ObjectId, ref: 'Audience' }, // Audience ID (referencing the Audience model)
  message: { type: String, required: true }, // Message of the campaign (required)
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' }, // Status of the campaign (sent or failed)
  createdAt: { type: Date, default: Date.now } // Date the campaign was created (defaults to current time)
});

// Create and export the Campaign model based on the schema
const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;