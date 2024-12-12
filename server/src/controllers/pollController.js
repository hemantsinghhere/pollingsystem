const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

/**
 * Create a new poll
 * @route POST /polls
 * @access Authenticated
 */
exports.createPoll = async (req, res) => {
  const { question, options, deadline } = req.body;

  if (!question || !options || !deadline) {
    return res.status(400).json({ error: 'Missing required fields: question, options, or deadline.' });
  }

  try {
    const uniqueId = crypto.randomBytes(8).toString('hex'); // Generate a unique ID for the poll

    const poll = await prisma.poll.create({
      data: {
        question,
        options,
        uniqueId,
        deadline: new Date(deadline),
        creatorId: req.user.id, // Associate the poll with the logged-in user
      },
    });

    res.status(201).json({
      message: 'Poll created successfully.',
      poll,
      shareableLink: `http://localhost:3000/polls/${uniqueId}`, // Replace with your deployed domain
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create poll.' });
  }
};

/**
 * Fetch poll details by unique ID
 * @route GET /polls/:uniqueId
 * @access Public
 */
exports.getPollByUniqueId = async (req, res) => {
  const { uniqueId } = req.params;

  try {
    const poll = await prisma.poll.findUnique({
      where: { uniqueId },
      include: { votes: true }, // Include related votes
    });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }

    res.status(200).json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch poll details.' });
  }
};

/**
 * Fetch all polls
 * @route GET /polls
 * @access Authenticated
 */
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await prisma.poll.findMany({
      where: { creatorId: req.user.id }, // Fetch only polls created by the logged-in user
      include: { votes: true }, // Include related votes
    });

    res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch polls.' });
  }
};

/**
 * Delete a poll by unique ID
 * @route DELETE /polls/:uniqueId
 * @access Admin Only
 */
exports.deletePoll = async (req, res) => {
  const { uniqueId } = req.params;

  try {
    const poll = await prisma.poll.findUnique({ where: { uniqueId } });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }

    // Check if the user is the creator or an admin
    if (poll.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You do not have permission to delete this poll.' });
    }

    await prisma.poll.delete({ where: { uniqueId } });

    res.status(200).json({ message: 'Poll deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete poll.' });
  }
};
