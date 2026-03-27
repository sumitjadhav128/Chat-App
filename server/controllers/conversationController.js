const Conversation = require("../models/Conversation");


// Create new conversation
exports.createConversation = async (req,res)=>{
try{

const { members } = req.body;

const existingConversation = await Conversation.findOne({
members: { $all: members },
isGroup:false
});

if(existingConversation){
return res.status(200).json(existingConversation);
}

const newConversation = new Conversation({
members
});

const savedConversation = await newConversation.save();

res.status(200).json(savedConversation);

}catch(err){
res.status(500).json(err);
}
};


// Get all conversations of a user
exports.getUserConversations = async (req, res) => {
  try {

    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] }
    }).populate("members", "name email");;

    res.status(200).json(conversations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};