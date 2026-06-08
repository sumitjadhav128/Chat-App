import API from "../services/api";
import { useState, useContext, useEffect } from "react";
import socket from "../services/socket";
import { AuthContext } from "../context/AuthContext";

export default function MessageInput({ conversation, replyMessage, setReplyMessage }) {

const [text, setText] = useState("");
const [file,setFile] = useState(null);
const { currentUser } = useContext(AuthContext);

//  Typing Indigetor
useEffect(()=>{

if(!conversation) return;

const timeout = setTimeout(()=>{

socket.emit("stop-typing",{
conversationId: conversation._id,
senderId: currentUser._id
});

},1000);

if(text){

socket.emit("typing",{
conversationId: conversation._id,
senderId: currentUser._id
});

}

return ()=>clearTimeout(timeout);

},[text]);

const handleSend = async () => {

if(!conversation) return;

let attachments = [];


// upload file first

if(file){

const formData = new FormData();

formData.append("file", file);

const uploadRes = await API.post(
"/upload",
formData
);

attachments.push(uploadRes.data.fileUrl);

}


socket.emit("send-message",{
conversationId: conversation._id,
senderId: currentUser._id,
text,
attachments,
replyTo: replyMessage?._id || null
});

setText("");
setFile(null);
setReplyMessage(null);

};


// ENTER KEY SUPPORT

const handleKeyDown = (e) => {

if(e.key === "Enter" && !e.shiftKey){

e.preventDefault();
handleSend();

}

};


return(

<div style={{borderTop:"1px solid #ccc", padding:"10px"}}>

{/* Reply preview */}

{replyMessage && (

<div style={{
background:"#eee",
padding:"5px",
marginBottom:"5px",
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<span>
Replying to: {replyMessage.text}
</span>

<button
onClick={()=>setReplyMessage(null)}
>
Cancel
</button>

</div>

)}

{/* Input area */}

<div style={{display:"flex"}}>

<textarea
value={text}
onChange={(e)=>setText(e.target.value)}
onKeyDown={handleKeyDown}
style={{
flex:1,
padding:"8px",
resize:"none",
height:"40px"
}}
placeholder="Type a message"
/>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

<button
onClick={handleSend}
style={{marginLeft:"10px"}}
>
Send
</button>

</div>

</div>

);

}