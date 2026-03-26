import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



export default function ChatPage(){

const [conversations,setConversations] = useState([]);
const [currentChat,setCurrentChat] = useState(null);

// const userId = "69aec2cc771c6249207fe8f2"; // temporary

 const { currentUser } = useContext(AuthContext);
 const userId = currentUser._id;

useEffect(()=>{

if(!currentUser) return;

API.get("/conversations/"+currentUser._id) // currentUser.user._id
.then(res=>{
setConversations(res.data);
})
.catch(err=>{
console.log(err);
});

},[currentUser]);

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