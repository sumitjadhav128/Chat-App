import { useEffect, useState, useContext, useRef } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { AuthContext } from "../context/AuthContext";
import socket from "../services/socket";
import UpdateProfile from "../components/updateProfile";

import "../styles/ChatPage.css"

export default function ChatPage(){

const [messages,setMessages] = useState([]);
const [conversations,setConversations] = useState([]);
const [currentChat,setCurrentChat] = useState(null);
const [replyMessage,setReplyMessage] = useState(null);
const { currentUser } = useContext(AuthContext);
const [onlineUsers,setOnlineUsers] = useState([]);

const bottomRef = useRef(null);

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


return (
  <div className="chat-page-container">
    
    {/* Add responsive dynamic classes to Sidebar wrapper container */}
    <div className={`chat-sidebar ${currentChat ? "hide-on-mobile" : ""}`}>
      <Sidebar
        conversations={conversations}
        setConversations={setConversations}
        setCurrentChat={setCurrentChat}
        onlineUsers={onlineUsers}
      />
    </div>

    {/* Add responsive dynamic classes to ChatWindow wrapper container */}
    <div className={`chat-window ${currentChat ? "show-on-mobile" : "hide-on-mobile"}`}>
      
      {/* 📱 MOBILE HEADER: This injects a clean top navigation bar on phones */}
      {currentChat && (
        <div className="mobile-chat-header">
          <button
            className="back-btn" style={{ height: "8px"}} 
            onClick={() => setCurrentChat(null)} // Setting currentChat to null returns to Sidebar view
          >
            ← Back
          </button>
          <span className="user-name" style={{ margin: 0 }}>
            {currentChat.isGroup
              ? currentChat.groupName || "Group Chat"
              : ""}
          </span>
        </div>
      )}

      <ChatWindow
        currentChat={currentChat}
        messages={messages}
        setMessages={setMessages}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
      />
    </div>

  </div>
);

}