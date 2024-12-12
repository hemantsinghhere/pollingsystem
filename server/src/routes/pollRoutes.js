const express = require('express');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { createPoll, getPollByUniqueId, getAllPolls, deletePoll } = require('../controllers/pollController');
const router = express.Router();

// Create a Poll
router.post('/', isAuthenticated, createPoll);

// Fetch Poll by Unique ID
router.get('/:uniqueId', getPollByUniqueId);

// Fetch All Polls (Optional)
router.get('/', isAuthenticated, getAllPolls);

// Delete a Poll (Admin Only)
router.delete('/:uniqueId', isAuthenticated, isAdmin, deletePoll);

module.exports = router;
