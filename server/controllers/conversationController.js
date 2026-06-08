const Conversation = require("../models/Conversation");
const { getIo } =
require("../socket/socketServer");

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

const populatedConversation =
await Conversation.findById(savedConversation._id)
.populate("members","name email");

 io = getIo();

io.emit(
"new-conversation",
populatedConversation
);

res.status(200).json(populatedConversation);

}catch(err){
res.status(500).json(err);
}
};


// Get all conversations of a user
exports.getUserConversations = async (req, res) => {
  try {

    const conversations = await Conversation.find({
members: { $in: [req.params.userId] }
})
.populate("members","name email");

    res.status(200).json(conversations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create group conversation
exports.createGroupConversation = async (req,res)=>{

try{

const { groupName, members } = req.body;

const creatorId = req.user.id;

const finalMembers = [
  creatorId,
  ...members
];

const uniqueMembers = [...new Set(finalMembers)];

const conversation = await Conversation.create({

groupName,
members: uniqueMembers,
isGroup: true,
groupAdmin: creatorId

});

const populatedConversation =
await Conversation.findById(conversation._id)
.populate("members","name email")
.populate("groupAdmin","name email");

const io = req.app.get("io");


res.status(201).json(populatedConversation);

}catch(error){

res.status(500).json({
error:error.message
});

}

};