const mongoose = require('mongoose');

// Define Order schema
const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create and export Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;