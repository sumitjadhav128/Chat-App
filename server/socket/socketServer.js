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

const getUser = (userId) => {
return onlineUsers.find(user => user.userId === userId);
};

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
socket.on("send-message",({conversationId, senderId, text})=>{

io.to(conversationId).emit("receive-message",{
conversationId,
senderId,
text
});

});

socket.on("disconnect",()=>{
console.log("User disconnected:",socket.id);
removeUser(socket.id);
io.emit("get-users", onlineUsers);
});

});

}

module.exports = setupSocket;