const express = require('express');
const Campaign = require('../models/Campaign'); 
const Audience = require('../models/Audience');  
const moment = require('moment');  
const router = express.Router();
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('audience')  
      .sort({ createdAt: -1 }); 

    if (campaigns.length === 0) {
      return res.status(404).json({ message: 'No campaigns found' });
    }
    const formattedCampaigns = campaigns.map(campaign => ({
      ...campaign.toObject(),
      createdAt: moment(campaign.createdAt).format('YYYY-MM-DD HH:mm:ss'), // Formatting the date
    }));

    res.json(formattedCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
});
router.post('/campaigns', async (req, res) => {
  try {
    const { name, audienceId, message, status } = req.body;
    if (!name || !message || !audienceId) {
      return res.status(400).json({ message: 'Campaign name, message, and audience are required.' });
    }
    const audience = await Audience.findById(audienceId);

    if (!audience) {
      return res.status(404).json({ message: 'Audience not found' });
    }
    const audienceSize = audience.audienceSize; 

    if (audienceSize === 0) {
      return res.status(400).json({ message: 'Audience segment has no customers' });
    }
    const newCampaign = new Campaign({
      name,
      audience: audience._id, 
      message,
      status: status || 'sent', 
    });
    await newCampaign.save();

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaign,
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Error creating campaign' });
  }
});
router.get('/campaigns/audience/:audienceId', async (req, res) => {
  try {
    const { audienceId } = req.params;
    if (!audienceId) {
      return res.status(400).json({ message: 'Audience ID is required.' });
    }

    const campaigns = await campaignsCollection.find({ audienceId }).toArray();
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Failed to fetch campaigns.' });
  }
});

// router.get('/campaigns/audience/:audienceId', async (req, res) => {
//   try {
//     const { audienceId } = req.params;
//     const campaigns = await Campaign.find({ audience: audienceId }).sort({ createdAt: -1 }); // Sort by createdAt in descending order

//     if (!campaigns.length) {
//       return res.status(404).json({ message: 'No campaigns found for this audience' });
//     }

//     // Format the campaigns' createdAt date
//     const formattedCampaigns = campaigns.map(campaign => ({
//       ...campaign.toObject(),
//       createdAt: moment(campaign.createdAt).format('YYYY-MM-DD HH:mm:ss'), // Formatting the date
//     }));

//     res.json(formattedCampaigns);
//   } catch (error) {
//     console.error('Error fetching campaigns for audience:', error);
//     res.status(500).json({ message: 'Error fetching campaigns for this audience' });
//   }
// });

// --- Get Campaign by ID --- 
router.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('audience');  // Populate audience details
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Format the createdAt date before sending the response
    const formattedCampaign = {
      ...campaign.toObject(),
      createdAt: moment(campaign.createdAt).format('YYYY-MM-DD HH:mm:ss'), // Formatting the date
    };

    res.json(formattedCampaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Error fetching campaign' });
  }
});

// --- Update Campaign --- 
router.put('/campaigns/:id', async (req, res) => {
  try {
    const { name, audienceId, message, status } = req.body;

    // Find the campaign by ID and update
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { name, audience: audienceId, message, status },
      { new: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({
      message: 'Campaign updated successfully',
      campaign: updatedCampaign,
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Error updating campaign' });
  }
});

// --- Delete Campaign --- 
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!deletedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Error deleting campaign' });
  }
});

module.exports = router;
