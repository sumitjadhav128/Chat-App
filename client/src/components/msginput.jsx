export default function MessageList({ conversation, setReplyMessage }) {

const [messages,setMessages] = useState([]);
const { currentUser } = useContext(AuthContext);

const bottomRef = useRef(null);


useEffect(()=>{

if(!conversation) return;

API.get("/messages/"+conversation._id)
.then(res=>{
setMessages(res.data);
});

},[conversation]);

// auto scroll after msg
useEffect(() => {

  bottomRef.current?.scrollIntoView({
    behavior: "smooth"
  });

}, [messages.length]);

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


return (
  <div className="message-list">
    {messages.map((msg) => {
      const isMine = String(msg.senderId) === String(currentUser._id);

      return (
        <div
          id={`msg-${msg._id}`}
          key={msg._id}
          className={`message-row ${isMine ? "mine" : "other"}`}
        >

          <div ref={bottomRef}></div>
          <div className="message-bubble">
            
            {/* File Attachments */}
            {msg.attachments?.map((file, i) => (
              <img
                key={i}
                src={file}
                alt=""
                className="message-attachment"
              />
            ))}

            {/* Reply Preview Core Window */}
            {msg.replyTo && (
              <div
                onClick={() => scrollToMessage(msg.replyTo._id)}
                className="reply-preview-container"
              >
                ↩ {msg.replyTo.text}
              </div>
            )}

            {/* Message text block style */}
            <div className={`message-text ${msg.isDeleted ? "deleted" : ""}`}>
              {msg.isDeleted ? "Message deleted" : msg.text}
            </div>

            {/* Dynamic Status Delivery Ticks */}
            {isMine && (
              <div className={`msg-status-tick ${msg.seenBy?.length > 1 ? "seen" : "unseen"}`}>
                {msg.seenBy?.length >= 2 ? "✓✓" : "✓"}
              </div>
            )}

            {/* Collapsed Clean Reaction Display logic mapping */}
            {msg.reactions?.length > 0 && (
              <div className="reactions-wrapper">
                {Object.entries(
                  msg.reactions.reduce((acc, reaction) => {
                    if (!acc[reaction.emoji]) {
                      acc[reaction.emoji] = 0;
                    }
                    acc[reaction.emoji]++;
                    return acc;
                  }, {})
                ).map(([emoji, count]) => (
                  <div key={emoji} className="reaction-badge">
                    {emoji} {count}
                  </div>
                ))}
              </div>
            )}

            {/* Message Action Sheet Triggers */}
            <div className="message-actions-bar">
              <button onClick={() => handleReply(msg)} className="action-btn">
                Reply
              </button>
              <button onClick={() => reactToMessage(msg, "👍")} className="action-btn">
                👍
              </button>
              <button onClick={() => reactToMessage(msg, "❤️")} className="action-btn">
                ❤️
              </button>
              <button onClick={() => reactToMessage(msg, "😂")} className="action-btn">
                😂
              </button>

              {isMine && (
                <>
                  <button onClick={() => handleEdit(msg)} className="action-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(msg)} className="action-btn delete">
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