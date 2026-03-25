import { useEffect, useState } from "react";
import API from "../services/api";

export default function MessageList({conversation}){

const [messages,setMessages] = useState([]);

useEffect(()=>{

if(!conversation) return;

API.get("/messages/"+conversation._id)
.then(res=>{
setMessages(res.data);
})
.catch(err=>{
console.log(err);
});

},[conversation]);

return(

<div style={{
flex:1,
overflowY:"scroll",
padding:"10px"
}}>

{messages.map((msg)=>(
<div
key={msg._id}
style={{
marginBottom:"10px",
padding:"8px",
background:"#f1f1f1",
borderRadius:"6px"
}}
>

{msg.text}

</div>
))}

</div>

);

}