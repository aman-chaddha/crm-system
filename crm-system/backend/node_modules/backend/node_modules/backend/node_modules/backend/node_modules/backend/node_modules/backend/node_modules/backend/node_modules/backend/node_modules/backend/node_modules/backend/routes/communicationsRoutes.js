// communicationsRoutes.js
const express = require('express');
const router = express.Router();
const CommunicationsLog = require('../models/CommunicationsLog');
router.post('/', async (req, res) => {
  const { name, email, segment, message } = req.body;

  // Validate data
  if (!name || !email || !segment || !message) {
    return res.status(400).json({ message: 'Please provide all fields (name, email, segment, message).' });
  }

  try {
    const newLog = new CommunicationsLog({
      name,
      email,
      segment,
      message,
      date: new Date(),
    });
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging communication' });
  }
});

module.exports = router;
