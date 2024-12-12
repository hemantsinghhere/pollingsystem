const express = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { castVote, getPollResults, getVotersForOption } = require('../controllers/voteController');
const router = express.Router();

// Cast a Vote
router.post('/:uniqueId', isAuthenticated, castVote);

// Fetch Poll Results
router.get('/:uniqueId/results', getPollResults);

// Fetch Users Who Voted for a Specific Option
router.get('/:uniqueId/option/:optionIndex', getVotersForOption);

module.exports = router;
