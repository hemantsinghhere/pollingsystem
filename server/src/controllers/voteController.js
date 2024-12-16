const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {io} = require('../app');

exports.castVote = async(req, res) => {
    const {pollId} = req.params;
    const { selectedOption } = req.body; // The index of the selected option
    const userId = req.user.id; 

    try{
        const poll = await prisma.poll.findUnique({
            where: {uniqueId: parseInt(pollId)},
        });

        if(!poll){
            return res.status(404).json({message: "Poll not found"});
        }

        const options = poll.options;

        if(selectedOption < 0 || selectedOption >= options.length){
            return res.status(400).json({message: "Invalid option selected"});
        }

        const vote = await prisma.vote.create({
            data: {
                userId,
                pollId: parseInt(pollId),
                selectedOption,
            }
        });
        res.status(201).json({ message: 'Vote cast successfully', vote });
    }catch{
        console.error('Error casting vote:', error);
        res.status(500).json({ message: 'An error occurred while casting your vote' });
    }
};