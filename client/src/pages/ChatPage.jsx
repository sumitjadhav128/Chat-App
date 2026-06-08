import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { AuthContext } from "../context/AuthContext";
import socket from "../services/socket";
import UpdateProfile from "../components/updateProfile";

export default function ChatPage(){

const [messages,setMessages] = useState([]);
const [conversations,setConversations] = useState([]);
const [currentChat,setCurrentChat] = useState(null);
const [replyMessage,setReplyMessage] = useState(null);
const { currentUser } = useContext(AuthContext);
const [onlineUsers,setOnlineUsers] = useState([]);

useEffect(()=>{

socket.emit("add-user", currentUser._id);

if(!currentUser) return;

API.get("/conversations/"+currentUser._id)
.then(res=>{
setConversations(res.data);
})
.catch(err=>{
console.log(err);
});

},[currentUser]);

useEffect(()=>{

socket.on("get-users",(users)=>{

setOnlineUsers(users);

});

return ()=>{

socket.off("get-users");

};

},[]);

// auto conversation loading
useEffect(()=>{

if(!currentUser) return;

socket.on(
"new-conversation",
(conversation)=>{

const isMember =
conversation.members.some(
member =>
String(member._id)
===
String(currentUser._id)
);

if(!isMember) return;

setConversations(prev=>{

const exists = prev.find(
c =>
String(c._id)
===
String(conversation._id)
);

if(exists) return prev;

return [
conversation,
...prev
];

});

});

return ()=>{

socket.off("new-conversation");

};

},[currentUser]);

return(

<div style={{display:"flex",height:"100vh"}}>

<Sidebar
conversations={conversations}
setConversations={setConversations}
setCurrentChat={setCurrentChat}
onlineUsers={onlineUsers}
/>

{/* <UpdateProfile>
</UpdateProfile> */}

<ChatWindow
currentChat={currentChat}
messages={messages}
setMessages={setMessages}
replyMessage={replyMessage}
setReplyMessage={setReplyMessage}
/>

</div>

);

}