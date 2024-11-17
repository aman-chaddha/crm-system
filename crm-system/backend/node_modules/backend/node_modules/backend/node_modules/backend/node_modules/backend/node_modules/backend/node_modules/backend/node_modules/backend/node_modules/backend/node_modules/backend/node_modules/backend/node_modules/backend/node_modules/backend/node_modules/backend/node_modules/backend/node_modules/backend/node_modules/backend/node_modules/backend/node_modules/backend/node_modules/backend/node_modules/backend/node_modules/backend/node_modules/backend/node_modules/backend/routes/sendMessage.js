const express = require('express');
const CommunicationsLog = require('../models/CommunicationsLog');
const router = express.Router();
router.post('/sendMessage', async (req, res) => {
    try {
      const { audience_name, audience_email } = req.body;
      if (!audience_name || !audience_email) {
        return res.status(400).json({ message: 'Missing audience_name or audience_email' });
      }
      const message = `Hi ${audience_name}, here’s 10% off on your next order!`;
      const newLog = new CommunicationsLog({
        audience_name,
        audience_email,
        message
      });
  
      const savedLog = await newLog.save();
      const deliveryStatus = Math.random() < 0.9 ? 'SENT' : 'FAILED';
      await updateDeliveryStatus(savedLog._id, deliveryStatus);
  
      res.status(200).json({ message: 'Message sent', deliveryStatus, logId: savedLog._id });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: 'Error sending message', error: error.message });
    }
  });
  async function updateDeliveryStatus(logId, status) {
    try {
      await CommunicationsLog.findByIdAndUpdate(logId, { 
        delivery_status: status,
        updated_at: Date.now() 
      });
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  }

module.exports = router;
