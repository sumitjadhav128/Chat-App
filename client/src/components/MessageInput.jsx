import { useState } from "react";

export default function MessageInput(){

const [text,setText] = useState("");

const handleSend = () => {

console.log("Send:",text);

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