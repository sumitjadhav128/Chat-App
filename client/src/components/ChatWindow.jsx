import { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import socket from "../services/socket";

export default function ChatWindow({
  currentChat,
  messages,
  setMessages,
  replyMessage,
  setReplyMessage,
}) {
  const [typingUser, setTypingUser] = useState(null);

  // Join conversation
  useEffect(() => {
    if (currentChat) {
      socket.emit("join-conversation", currentChat._id);
    }
  }, [currentChat]);

  // Typing listeners
  useEffect(() => {
    const handleTyping = (userId) => {
      setTypingUser(userId);
    };

    const handleStopTyping = () => {
      setTypingUser(null);
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, []);

  // Early return AFTER hooks
  if (!currentChat) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Select a conversation
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MessageList
        conversation={currentChat}
        messages={messages}
        setReplyMessage={setReplyMessage}
      />

      {typingUser && (
        <div
          style={{
            padding: "5px 10px",
            fontSize: "12px",
            color: "gray",
          }}
        >
          Typing...
        </div>
      )}

      <MessageInput
        conversation={currentChat}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
      />
    </div>
  );
}