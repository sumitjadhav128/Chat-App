import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({conversations,setConversations,setCurrentChat}){

const { currentUser } = useContext(AuthContext);

const startChat = async () => {
const otherUserId = prompt("Enter user id to chat");
if(!otherUserId) return;

try{

const res = await API.post("/conversations",{
members:[currentUser._id, otherUserId]
});

setConversations(prev => {

const exists = prev.find(c => c._id === res.data._id);

if(exists) return prev;

return [...prev, res.data];

});

setCurrentChat(res.data);

}catch(err){

console.log(err);

}

};

return(

<div style={{
width:"300px",
borderRight:"1px solid #ccc",
padding:"10px"
}}>

<button onClick={startChat}>
Start Chat
</button>

<h3>Chats</h3>

{
conversations.map((conv) =>  {

    
    console.log("members:", conv.members);
console.log("currentUser:", currentUser._id);

const otherMember = conv.members.find(
member => member._id !== currentUser._id
);

return (

<div
key={conv._id}
onClick={()=>setCurrentChat(conv)}
style={{
padding:"10px",
borderBottom:"1px solid #eee",
cursor:"pointer"
}}
>

{conv.isGroup
? "Group Chat"
: otherMember?.name || otherMember?.email}

</div>

);

})
}

</div>

);

}
