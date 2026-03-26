import { useState } from "react";
import socket from "../services/socket";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function MessageInput({conversation}){

const [text,setText] = useState("");

const userId = "69ae654f407212bde009c9ac"; // temporary
 const { currentUser } = useContext(AuthContext);

const handleSend = () => {

if(!text.trim()) return;

socket.emit("send-message",{

conversationId: conversation._id,
senderId: currentUser._id,  // senderId: currentUser.user._id,
text: text

});

setText("");

};

return(

<div style={{
display:"flex",
borderTop:"1px solid #ccc",
padding:"10px"
}}>

<input
value={text}
onChange={(e)=>setText(e.target.value)}
style={{flex:1,padding:"8px"}}
/>

<button
onClick={handleSend}
style={{marginLeft:"10px"}}
>
Send
</button>

</div>

);

}