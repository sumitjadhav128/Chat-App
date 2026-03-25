import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage(){

const [conversations,setConversations] = useState([]);
const [currentChat,setCurrentChat] = useState(null);

const userId = "69aec2cc771c6249207fe8f2"; // temporary

useEffect(()=>{

API.get("/conversations/"+userId)
.then(res=>{
setConversations(res.data);
})
.catch(err=>{
console.log(err);
});

},[]);

return(

<div style={{display:"flex",height:"100vh"}}>

<Sidebar
conversations={conversations}
setCurrentChat={setCurrentChat}
/>

<ChatWindow
currentChat={currentChat}
/>

</div>

);

}