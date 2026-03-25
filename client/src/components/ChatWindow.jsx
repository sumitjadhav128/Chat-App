import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({currentChat}){

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