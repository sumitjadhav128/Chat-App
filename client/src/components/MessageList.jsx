import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MessageList({conversation}){

const [messages,setMessages] = useState([]);
const { currentUser } = useContext(AuthContext);

useEffect(()=>{

if(!conversation) return;

API.get("/messages/"+conversation._id)
.then(res=>{
setMessages(res.data);
});

},[conversation]);


// realtime listener
useEffect(()=>{

socket.on("receive-message",(data)=>{

if(data.conversationId === conversation._id){

setMessages((prev)=>[...prev,data]);

}

});

return ()=>socket.off("receive-message");

},[conversation]);

return(

<div style={{
flex:1,
overflowY:"scroll",
padding:"10px"
}}>

{messages.map((msg)=>{

const isMine = msg.senderId === currentUser._id;

return(

<div
key={msg._id}
style={{
display:"flex",
justifyContent:isMine ? "flex-end" : "flex-start",
marginBottom:"10px"
}}
>

<div
style={{
maxWidth:"60%",
padding:"10px",
borderRadius:"10px",
background:isMine ? "#dcf8c6" : "#ffffff",
border:"1px solid #ddd"
}}
>

{msg.text}

<div style={{
fontSize:"10px",
textAlign:"right",
marginTop:"5px"
}}>
{new Date(msg.createdAt).toLocaleTimeString()}
</div>

</div>

</div>

);

})}

</div>

);

}