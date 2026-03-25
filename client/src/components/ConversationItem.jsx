export default function ConversationItem({conversation,setCurrentChat}){

return(

<div
onClick={()=>setCurrentChat(conversation)}
style={{
padding:"10px",
borderBottom:"1px solid #eee",
cursor:"pointer"
}}
>

Conversation: {conversation._id}

</div>

);

}