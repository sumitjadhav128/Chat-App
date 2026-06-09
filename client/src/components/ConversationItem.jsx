export default function ConversationItem({conversation,setCurrentChat}){

return (
  <div
    onClick={() => setCurrentChat(conversation)}
    className="conversation-item"
  >
    <span className="user-name" style={{fontSize: "13px"}}>
      Conversation: {conversation._id}
    </span>
  </div>
);

}