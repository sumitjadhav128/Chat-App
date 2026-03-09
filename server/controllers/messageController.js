const Message = require("../models/Message");


// Send message
exports.sendMessage = async (req, res) => {
  try {

    const newMessage = new Message(req.body);

    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get messages of a conversation
exports.getMessages = async (req, res) => {
  try {

    const messages = await Message.find({
      conversationId: req.params.conversationId
    });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};