// const mongoose = require('mongoose');

// const communicationsLogSchema = new mongoose.Schema({
//   audienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Audience', required: true },
//   message: { type: String, required: true },
//   status: { type: String, enum: ['SENT', 'FAILED'], default: 'SENT' },
//   deliveryStatus: { type: String, enum: ['SENT', 'FAILED'], default: 'SENT' },
//   timestamp: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('CommunicationsLog', communicationsLogSchema);

// module.exports = CommunicationLog;


const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  audience_name: { type: String, required: true },
  audience_email: { type: String, required: true },
  message: { type: String, required: true },
  delivery_status: { type: String, enum: ['SENT', 'FAILED'], default: 'SENT' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);

module.exports = CommunicationLog;
