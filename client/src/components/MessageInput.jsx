import API from "../services/api";
import { useState, useContext, useEffect, useRef  } from "react";
import socket from "../services/socket";
import { AuthContext } from "../context/AuthContext";
import { useNavigate} from "react-router-dom";

export default function MessageInput({ conversation, replyMessage, setReplyMessage }) {

const [text, setText] = useState("");
const [file,setFile] = useState(null);
const { currentUser } = useContext(AuthContext);
const [loading, SetLoading ] = useState(false)
const fileInputRef = useRef(null);

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
 try {
   SetLoading(true)
 console.log("frontend handlesend hit")
  if (!conversation) return;

  let attachments = [];

if (file) {
  const formData = new FormData();

  formData.append("conversationId", conversation._id);
  formData.append("senderId", currentUser._id);
  formData.append("text", text);
  formData.append("attachments", file);

  await API.post("/messages", formData);

  setText("");
  setFile(null);
  setReplyMessage(null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

  return;
}
 console.log("response sent")

  socket.emit("send-message", {
    conversationId: conversation._id,
    senderId: currentUser._id,
    text,
    attachments,
    replyTo: replyMessage?._id || null
  });

  setText("");
  setReplyMessage(null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

 } catch (error) {
    alert(
    JSON.stringify({
      message: error.message,
      code: error.code
    })
  );
console.log(error)
 } finally {
  SetLoading(false)
 }
};

// ENTER KEY SUPPORT

const handleKeyDown = (e) => {

if(e.key === "Enter" && !e.shiftKey){

e.preventDefault();
handleSend();

}

};


return (
  <div className="input-dock">
    {/* Input Reply Preview Tracker */}
    {replyMessage && (
      <div className="input-dock-reply-banner">
        <span>Replying to: <strong>{replyMessage.text}</strong></span>
        <button onClick={() => setReplyMessage(null)} className="action-btn" style={{color: "var(--danger-color)"}}>
          Cancel
        </button>
      </div>
    )}

    {/* Primary Text Entry Row layout */}
    <div className="input-row-layout">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="message-textarea"
        placeholder="Type a message..."
      />

      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="file-input-custom"
      />

      <button onClick={handleSend} className="send-btn">
        {loading? "..." : "Send"}
      </button>
    </div>
  </div>
);

}