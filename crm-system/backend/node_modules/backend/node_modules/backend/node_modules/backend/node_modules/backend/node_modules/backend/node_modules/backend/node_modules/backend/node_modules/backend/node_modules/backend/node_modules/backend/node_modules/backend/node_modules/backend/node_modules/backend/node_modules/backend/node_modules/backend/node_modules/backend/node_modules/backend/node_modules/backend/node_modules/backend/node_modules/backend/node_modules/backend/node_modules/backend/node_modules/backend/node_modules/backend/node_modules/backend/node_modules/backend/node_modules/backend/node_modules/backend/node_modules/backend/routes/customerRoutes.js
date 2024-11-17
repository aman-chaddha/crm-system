const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer with this email already exists.' });
    }
    const customer = new Customer({ name, email });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(400).json({ error: 'Failed to create customer.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers); 
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

module.exports = router;
