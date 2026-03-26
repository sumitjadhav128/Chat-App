import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import socket from "../services/socket";
import { useEffect } from "react";

export default function ChatWindow({currentChat}){

useEffect(()=>{

if(currentChat){

socket.emit("join-conversation", currentChat._id);

}

},[currentChat]);

if(!currentChat){

return(
<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
Select a conversation
</div>
);

}

return(

<div style={{flex:1,display:"flex",flexDirection:"column"}}>

<MessageList conversation={currentChat} />

<MessageInput conversation={currentChat} />

</div>

);

}