const express = require('express');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const router = express.Router();
router.post('/', async (req, res) => {  
  try {
    const { customerId, product, quantity, totalPrice } = req.body;
    if (!customerId || !product || !quantity || !totalPrice) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (typeof quantity !== 'number' || typeof totalPrice !== 'number') {
      return res.status(400).json({ error: 'Quantity and totalPrice must be numbers' });
    }
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const order = new Order({
      customer: customerId,
      product,
      quantity,
      totalPrice
    });
    await order.save();
    res.status(201).json(order);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });  
  }
});
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('customer');  
    res.status(200).json(orders); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;