const express = require('express');
const CommunicationsLog = require('../models/CommunicationsLog');
const router = express.Router();
router.post('/deliveryReceipt', async (req, res) => {
  const { logId, status } = req.body;

  try {
    const updatedLog = await CommunicationsLog.findByIdAndUpdate(
      logId,
      { delivery_status: status, updated_at: Date.now() },
      { new: true }
    );

    res.status(200).json({ message: 'Delivery status updated', log: updatedLog });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error });
  }
});

module.exports = router;

