require('dotenv').config();  
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  
  });
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/audiences', audienceRoutes);  
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});
const port = process.env.PORT || 5000;  
app.listen(port, () => console.log(`Server running on port ${port}`));
