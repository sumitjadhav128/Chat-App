const Message = require("../models/Message");
const { getIo } = require("../socket/socketServer");


// Send message
exports.sendMessage = async (req, res) => {
  try {
 
    console.log("sendMessage controller hit")
    console.log("FILE:", req.file);
    // console.log("BODY:", req.body);

    const newMessage = new Message({
      conversationId: req.body.conversationId,
      senderId: req.body.senderId,
      text: req.body.text || "",

      attachments: req.file
        ? [
            {
              url: req.file.path,        // Cloudinary URL ✔
              public_id: req.file.filename // Cloudinary public_id ✔
            }
          ]
        : [],

      replyTo: req.body.replyTo || null,
      seenBy: [req.body.senderId]
    });

    const savedMessage = await newMessage.save();
    // console.log(savedMessage)
    const io = getIo();

io.to(req.body.conversationId).emit(
  "receive-message",
  savedMessage
);

    res.status(201).json(savedMessage);

  } catch (error) {
    alert(error)
    console.log("SEND MESSAGE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get messages of a conversation
exports.getMessages = async (req, res) => {
  try {

    const messages = await Message.find({
conversationId: req.params.conversationId
}).sort({ createdAt: 1 }).populate("replyTo","text");

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};