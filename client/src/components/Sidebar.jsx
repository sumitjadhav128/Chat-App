import ConversationItem from "./ConversationItem";

export default function Sidebar({conversations,setCurrentChat}){

return(

<div style={{
width:"300px",
borderRight:"1px solid #ccc",
padding:"10px"
}}>

<h3>Chats</h3>

{conversations.map((conv)=>(
<ConversationItem
key={conv._id}
conversation={conv}
setCurrentChat={setCurrentChat}
/>
))}

</div>

);

}