const mongoose = require("mongoose");
const Message = require("../models/Message");
const socketio = require("socket.io");
let io;
function setupSocket(server) {

io = socketio(server,{
cors:{origin:"*"}
});

// store connected users
let onlineUsers = [];

const addUser = (userId, socketId) => {
if(!onlineUsers.some(user => user.userId === userId)){
onlineUsers.push({userId, socketId});
}
};

const removeUser = (socketId) => {
onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

// const getUser = (userId) => {
// return onlineUsers.find(user => user.userId === userId);
// };

io.on("connection",(socket)=>{

console.log("User connected:",socket.id);

// user joins a conversation room
socket.on("join-conversation",(conversationId)=>{

socket.join(conversationId);

console.log(`User ${socket.id} joined conversation ${conversationId}`);

});

socket.on("add-user",(userId)=>{
addUser(userId, socket.id);
io.emit("get-users", onlineUsers);
});


// send message to that room
socket.on("send-message", async ({
conversationId,
senderId,
text,
attachments,
replyTo=null
}) => {

try {

const newMessage = new Message({
conversationId,
senderId,
text,
attachments,
replyTo,
seenBy:[senderId]
});

const savedMessage = await newMessage.save();

const populatedMessage =
await Message.findById(savedMessage._id)
.populate("replyTo","text");

io.to(conversationId).emit(
"receive-message",
populatedMessage
);

console.log(populatedMessage);

} catch(error){

console.log("Message Save Error:",error);

}

});


// add edit msg
socket.on("edit-message", async ({ messageId, newText, senderId, conversationId }) => {

try{

const message = await Message.findById(messageId);

if(!message) return;

// ownership check
if(message.senderId.toString() !== senderId){
console.log("Unauthorized edit attempt");
return;
}

// update fields
message.text = newText;
message.isEdited = true;

await message.save();

io.to(conversationId).emit("message-edited",{
messageId: message._id,
newText: message.text,
isEdited: message.isEdited
});

}catch(err){
console.log("Edit Error:",err);
}

});

// add delete msg 
socket.on("delete-message", async ({ messageId, senderId, conversationId }) => {

try{

const message = await Message.findById(messageId);

if(!message) return;

// ownership check
if(message.senderId.toString() !== senderId){
console.log("Unauthorized delete attempt");
return;
}

// mark as deleted
message.text = "";
message.attachments = [];
message.isDeleted = true;

await message.save();

io.to(conversationId).emit("message-deleted",{
messageId: message._id
});

}catch(err){
console.log("Delete Error:",err);
}

});

// add reaction
socket.on("add-reaction", async ({ messageId, userId, emoji, conversationId }) => {
    try {
        const message = await Message.findById(messageId);
        if(!message) return;

        const index = message.reactions.findIndex(r => r.userId.toString() === userId);

        if(index !== -1){
            if(message.reactions[index].emoji === emoji){
                // remove reaction
                message.reactions.splice(index,1);
            }else{
                // change reaction
                message.reactions[index].emoji = emoji;
            }
        }else{
            // add new reaction
            message.reactions.push({userId, emoji});
        }

        await message.save();

        // Emit to ALL sockets in the conversation room
        io.to(conversationId).emit("reaction-updated", {
            messageId,
            reactions: message.reactions
        });

    } catch(err) {
        console.log("Reaction error:", err);
    }
});

// disconnect
socket.on("disconnect",()=>{
console.log("User disconnected:",socket.id);
removeUser(socket.id);
io.emit("get-users", onlineUsers);
});

//typing event
socket.on("typing", ({ conversationId, senderId }) => {

socket.to(conversationId).emit("typing", senderId);

});

//stop typing event
socket.on("stop-typing", ({ conversationId, senderId }) => {

socket.to(conversationId).emit("stop-typing", senderId);

});

// seen, unseen

socket.on("mark-seen", async ({conversationId,userId})=>{

try{

await Message.updateMany(
{
conversationId: new mongoose.Types.ObjectId(conversationId),
seenBy: {
$ne: new mongoose.Types.ObjectId(userId)
}
},
{
$push:{
seenBy: new mongoose.Types.ObjectId(userId)
}
}
);

const updatedMessages = await Message.find({
conversationId: new mongoose.Types.ObjectId(conversationId)
});

io.to(conversationId).emit(
"messages-seen",
updatedMessages
);

}catch(err){

console.log("mark-seen error:",err);

}

});

});

}

function getIo(){

return io;

}

module.exports = {
setupSocket,
getIo
};