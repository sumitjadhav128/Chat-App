const Message = require("../models/Message");
const socketio = require("socket.io");

function setupSocket(server) {

const io = socketio(server,{
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

console.log("User joined conversation:", conversationId);

});

socket.on("add-user",(userId)=>{
addUser(userId, socket.id);
io.emit("get-users", onlineUsers);
});


// send message to that room
socket.on("send-message", async ({ conversationId, senderId, text, attachments }) => {

try {

const newMessage = new Message({
conversationId: conversationId,
senderId: senderId,
text: text,
attachments,
seenBy: [senderId] // sender has seen their own message
});

const savedMessage = await newMessage.save();

io.to(conversationId).emit("receive-message", {
_id: savedMessage._id,
conversationId: savedMessage.conversationId,
senderId: savedMessage.senderId,
text: savedMessage.text,
seenBy: savedMessage.seenBy,
attachments: savedMessage.attachments,
createdAt: savedMessage.createdAt
});

console.log(savedMessage);

} catch (error) {

console.log("Message Save Error:", error);

}

});

//read recepit
socket.on("mark-seen", async ({ messageId, userId }) => {

try {

const message = await Message.findById(messageId);

if (!message.seenBy.includes(userId)) {
message.seenBy.push(userId);
await message.save();
}

io.to(message.conversationId).emit("message-seen", {
messageId: message._id,
seenBy: message.seenBy
});

} catch (error) {

console.log("Seen update error:", error);

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

});

}

module.exports = setupSocket;