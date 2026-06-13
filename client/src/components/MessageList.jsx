import { useEffect, useState, useContext, useRef } from "react";
import API from "../services/api";
import socket from "../services/socket";
import { AuthContext } from "../context/AuthContext";

export default function MessageList({ conversation, setReplyMessage }) {

  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const bottomRef = useRef(null);

  // ----------------------------
  // LOAD INITIAL MESSAGES
  // ----------------------------
  useEffect(() => {
    if (!conversation?._id) return;

    API.get("/messages/" + conversation._id)
      .then(res => {
        setMessages(res.data || []);
      });

  }, [conversation?._id]);

  // ----------------------------
  // AUTO SCROLL
  // ----------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------------------
  // SOCKET: REALTIME MESSAGES
  // ----------------------------
  useEffect(() => {
    if (!conversation?._id) return;

    const handleReceive = (data) => {
      if (data.conversationId !== conversation._id) return;

      setMessages(prev => {
        // prevent duplicates
        if (prev.some(m => m._id === data._id)) return prev;
        return [...prev, data];
      });

      socket.emit("mark-seen", {
        conversationId: conversation._id,
        userId: currentUser._id
      });
    };

    const handleEdit = (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId
            ? { ...msg, text: data.newText, isEdited: true }
            : msg
        )
      );
    };

    const handleDelete = (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId
            ? { ...msg, text: "Message deleted", isDeleted: true }
            : msg
        )
      );
    };

    const handleReaction = (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId
            ? { ...msg, reactions: data.reactions }
            : msg
        )
      );
    };

    socket.on("receive-message", handleReceive);
    socket.on("message-edited", handleEdit);
    socket.on("message-deleted", handleDelete);
    socket.on("reaction-updated", handleReaction);

    return () => {
      socket.off("receive-message", handleReceive);
      socket.off("message-edited", handleEdit);
      socket.off("message-deleted", handleDelete);
      socket.off("reaction-updated", handleReaction);
    };

  }, [conversation?._id, currentUser?._id]);

  // ----------------------------
  // SEEN EVENT (SAFE VERSION)
  // ----------------------------
  useEffect(() => {
    if (!conversation?._id) return;

    socket.emit("mark-seen", {
      conversationId: conversation._id,
      userId: currentUser._id
    });

    const handleSeen = (updatedMessages) => {
      setMessages(prev =>
        prev.map(msg => {
          const updated = updatedMessages.find(m => m._id === msg._id);
          return updated ? updated : msg;
        })
      );
    };

    socket.on("messages-seen", handleSeen);

    return () => {
      socket.off("messages-seen", handleSeen);
    };

  }, [conversation?._id]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="message-list">

      {messages.map(msg => {

        const isMine =
          String(msg.senderId) === String(currentUser._id);

        return (
          <div
            key={msg._id}
            className={`message-row ${isMine ? "mine" : "other"}`}
            id={`msg-${msg._id}`}
          >

            <div className="message-bubble">

              {/* TEXT */}
              {msg.text && (
                <div className={`message-text ${msg.isDeleted ? "deleted" : ""}`}>
                  {msg.isDeleted ? "Message deleted" : msg.text}
                </div>
              )}

              {/* ATTACHMENTS (SAFE) */}
              {Array.isArray(msg.attachments) &&
                msg.attachments.map((file, i) => (
                  <img
                    key={i}
                    src={file.url}
                    alt="attachment"
                    className="message-attachment"
                  />
                ))
              }

              {/* STATUS */}
              {isMine && (
                <div className="msg-status-tick">
                  {msg.seenBy?.length > 1 ? "✓✓" : "✓"}
                </div>
              )}

              {/* REACTIONS */}
              {msg.reactions?.length > 0 && (
                <div className="reactions-wrapper">
                  {msg.reactions.map((r, i) => (
                    <span key={i} className="reaction-badge">
                      {r.emoji}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}