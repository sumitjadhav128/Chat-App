const Conversation = require("../models/Conversation");


// Create new conversation
exports.createConversation = async (req, res) => {
  try {
    console.log(req.body);
    const { senderId, receiverId } = req.body;

    const newConversation = new Conversation({
      members: [senderId, receiverId]
    });

    const savedConversation = await newConversation.save();

    res.status(201).json(savedConversation);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all conversations of a user
exports.getUserConversations = async (req, res) => {
  try {

    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] }
    });

    res.status(200).json(conversations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};