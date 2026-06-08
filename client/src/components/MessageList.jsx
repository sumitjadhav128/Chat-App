import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import socket from "../services/socket";
import { AuthContext } from "../context/AuthContext";

export default function MessageList({ conversation, setReplyMessage }) {

const [messages,setMessages] = useState([]);
const { currentUser } = useContext(AuthContext);


useEffect(()=>{

if(!conversation) return;

API.get("/messages/"+conversation._id)
.then(res=>{
setMessages(res.data);
});

},[conversation]);


// receive new message
useEffect(()=>{

socket.on("receive-message",(data)=>{

if(data.conversationId === conversation._id){

setMessages(prev=>[...prev,data]);

// instantly mark new message as seen
socket.emit("mark-seen",{
conversationId: conversation._id,
userId: currentUser._id
});

}

});


socket.on("message-edited",(data)=>{

setMessages(prev =>
prev.map(msg =>
msg._id === data.messageId
? {...msg,text:data.newText,isEdited:true}
: msg
)
);

});


socket.on("message-deleted",(data)=>{

setMessages(prev =>
prev.map(msg =>
msg._id === data.messageId
? {...msg,text:"Message deleted",isDeleted:true}
: msg
)
);

});


socket.on("reaction-updated",(data)=>{

setMessages(prev =>
prev.map(msg =>
msg._id === data.messageId
? {...msg,reactions:data.reactions}
: msg
)
);

});


return ()=>{
socket.off("receive-message");
socket.off("message-edited");
socket.off("message-deleted");
socket.off("reaction-updated");
};

},[conversation]);

// seen
useEffect(()=>{

if(!conversation) return;

socket.emit("mark-seen",{
conversationId: conversation._id,
userId: currentUser._id
});

socket.on("messages-seen",(updatedMessages)=>{

setMessages(updatedMessages);

});

return ()=>{

socket.off("messages-seen");

};

},[conversation]);

// ACTIONS

const reactToMessage = (msg,emoji)=>{

socket.emit("add-reaction",{
messageId: msg._id,
userId: currentUser._id,
emoji,
conversationId: msg.conversationId
});

};

const handleReply = (msg)=>{
setReplyMessage(msg);
};

const handleEdit = (msg)=>{

const newText = prompt("Edit message",msg.text);

if(!newText) return;

socket.emit("edit-message",{
messageId: msg._id,
senderId: currentUser._id,
newText,
conversationId: msg.conversationId
});

};

const handleDelete = (msg)=>{

socket.emit("delete-message",{
messageId: msg._id,
senderId: currentUser._id,
conversationId: msg.conversationId
});

};

// msg scroll effect
const scrollToMessage = (messageId)=>{

const element =
document.getElementById(`msg-${messageId}`);

if(!element) return;

element.scrollIntoView({
behavior:"smooth",
block:"center",
});

element.style.backgroundColor="#fff3cd";

setTimeout(()=>{

element.style.backgroundColor="";

},1500);

};


return(

<div style={{
flex:1,
overflowY:"scroll",
padding:"10px"
}}>

{messages.map((msg)=>{

const isMine =
String(msg.senderId) === String(currentUser._id);

return(

<div
id={`msg-${msg._id}`}
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

    {/* // msg text */}


 {/* file attachments */}
    {msg.attachments?.map((file,i)=>(

<img
key={i}
src={file}
alt=""
style={{
width:"200px",
marginTop:"5px",
borderRadius:"5px"
}}
/>

))}

{/* reply preview */}

{msg.replyTo && (

<div
onClick={()=>
scrollToMessage(msg.replyTo._id)
}
style={{
fontSize:"12px",
background:"#eee",
padding:"3px",
marginBottom:"5px",
borderLeft:"3px solid gray",
cursor:"pointer"
}}
>

↩ {msg.replyTo.text}

</div>

)}


{/* message text */}

<div>

{msg.isDeleted
? "Message deleted"
: msg.text}

</div>

{isMine && (

<div style={{
fontSize:"11px",
textAlign:"right",
marginTop:"3px",
color:
msg.seenBy?.length > 1
? "blue"
: "gray"
}}>

{msg.seenBy?.length >= 2 ? "✓✓" : "✓"}

</div>

)}

{/* reactions display */}

{/* {msg.reactions?.length > 0 && (

<div style={{marginTop:"5px"}}>

{msg.reactions.map((r,i)=>(
<span key={i}>
{r.emoji}
</span>
))}

</div>

)} */}

{msg.reactions?.length > 0 && (

<div style={{
marginTop:"5px",
display:"flex",
gap:"5px",
flexWrap:"wrap"
}}>

{Object.entries(

msg.reactions.reduce((acc,reaction)=>{

if(!acc[reaction.emoji]){

acc[reaction.emoji] = 0;

}

acc[reaction.emoji]++;

return acc;

},{})

).map(([emoji,count])=>(

<div
key={emoji}
style={{
background:"#eee",
padding:"2px 8px",
borderRadius:"12px",
fontSize:"13px"
}}
>

{emoji} {count}

</div>

))}

</div>

)}


{/* ACTIONS */}

<div style={{
marginTop:"5px",
display:"flex",
gap:"5px",
fontSize:"12px"
}}>

<button onClick={()=>handleReply(msg)}>
Reply
</button>

<button onClick={()=>reactToMessage(msg,"👍")}>
👍
</button>

<button onClick={()=>reactToMessage(msg,"❤️")}>
❤️
</button>

<button onClick={()=>reactToMessage(msg,"😂")}>
😂
</button>


{isMine && (

<>

<button onClick={()=>handleEdit(msg)}>
Edit
</button>

<button onClick={()=>handleDelete(msg)}>
Delete
</button>

</>

)}

</div>

</div>

</div>

);

})}

</div>

);

}