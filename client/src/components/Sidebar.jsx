import API from "../services/api";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({conversations,setConversations,setCurrentChat, onlineUsers}){

const { currentUser } = useContext(AuthContext);
const [search,setSearch] = useState("");
const [results,setResults] = useState([]);

const [showGroupModal,setShowGroupModal] = useState(false);
const [groupName,setGroupName] = useState("");
const [groupSearch, setGroupSearch] = useState("");
const [groupResults, setGroupResults] = useState([]);
const [selectedMembers, setSelectedMembers] = useState([]);

// when components mount
useEffect(() => {

  if(!search.trim()){

    API.get("/user")
      .then(res => {
        setResults(res.data);
      })
      .catch(console.log);

    return;
  }

  API.get("/user/search/" + search)
    .then(res => {
      setResults(res.data);
    })
    .catch(console.log);

}, [search]);

// search parameter
useEffect(()=>{

if(!search.trim()){

setResults([]);
return;

}

API.get("/user/search/"+search)
.then(res=>{

setResults(res.data);

})
.catch(console.log);

},[search]);

// seprate search for group members
useEffect(() => {

  if (!groupSearch.trim()) {
    setGroupResults([]);
    return;
  }

  API.get("/user/search/" + groupSearch)
    .then(res => setGroupResults(res.data))
    .catch(console.log);

}, [groupSearch]);


// const startChat = async () => {
// const otherUserId = prompt("Enter user id to chat");
// if(!otherUserId) return;

// try{
// const res = await API.post("/conversations",{
// members:[currentUser._id, otherUserId]
// });

// setConversations(prev => {

// const exists = prev.find(c => c._id === res.data._id);

// if(exists) return prev;

// return [...prev, res.data];

// });

// setCurrentChat(res.data);

// }catch(err){

// console.log(err);

// }

// };

// start chat
const startChat = async(user)=>{

try{

const res = await API.post("/conversations",{
members:[
currentUser._id,
user._id
]
});

setConversations(prev=>{

const exists = prev.find(
c => c._id === res.data._id
);

if(exists) return prev;

return [res.data,...prev];

});

setCurrentChat(res.data);

setSearch("");
setResults([]);

}catch(error){

console.log(error);

}

};

// toggle member selection
const toggleMember = (userId)=>{

setSelectedMembers(prev=>{

if(prev.includes(userId)){

return prev.filter(id => id !== userId);

}

return [...prev,userId];

});

};

// create group function
const createGroup = async()=>{

if(!groupName.trim()) return;

try{

const res = await API.post("/conversations/group",{

groupName,

members:[
currentUser._id,
...selectedMembers
]

});

setConversations(prev=>[
res.data,
...prev
]);

setCurrentChat(res.data);

setShowGroupModal(false);

setGroupName("");

setSelectedMembers([]);

}catch(error){

console.log(error);

}

};

return (
  <div className="chat-sidebar">
    <input
      type="text"
      placeholder="🔍 Search users"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
    />

    {/* Render User Results */}

    <h3 className="section-title">  Discover People</h3>
    {results.map((user) => (
      <div
        key={user._id}
        onClick={() => startChat(user)}
        className="user-search-item"
      >
         <div className="user-avatar">
    {user.name?.charAt(0).toUpperCase()}
  </div> 
       <div style={{ paddingLeft: "10px"}}>
        {user.name}
        <div className="user-email">  {user.email}</div>
       </div>

       <button className="chat-btn">Chat</button>
      </div>
    ))}

    <button onClick={() => setShowGroupModal(true)} className="btn-primary">
      + Create Group
    </button>

    <h3 className="section-title">Your Chats</h3>

    {conversations.map((conv) => {
      const otherUser = conv.members.find(
        (member) => String(member._id) !== String(currentUser._id)
      );

      const isOnline = onlineUsers.some(
        (user) => String(user.userId) === String(otherUser?._id)
      );

      return (
        <div
          key={conv._id}
          onClick={() => setCurrentChat(conv)}
          className="conversation-item"
        >
          <div style={{display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div className="user-avatar">
  {conv.isGroup
    ? conv.groupName && conv.groupName.charAt(0).toUpperCase()
    : otherUser?.name?.charAt(0).toUpperCase()}
</div>

 <div style={{paddingLeft: "10px"}}>{conv.isGroup ? conv.groupName || "Group Chat" : otherUser?.name || otherUser?.email || "User"}
 
 <div style={{ fontSize: "14px", color:"#64748b"}}> {conv.isGroup && "Group Chat"}</div>

   {!conv.isGroup && (
              <div style={{fontSize: "14px"}}  className={`status-text ${isOnline ? "status-online" : ""}`}>
                {isOnline ? "● Online" : "Offline"}

                 {conv.isGroup && "Group Chat"}
              </div>
            )}
 </div>

           
          </div>
        </div>
      );
    })}

    {/* Group Creation Modal Overlay */}
    {showGroupModal && (
      <div className="modal-overlay-backdrop">
        <div className="modal-surface-card">
          <h3>Create Group</h3>

          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="search-input"
          />

          <input
            type="text"
            placeholder="Search members..."
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
            className="search-input"
          />

          <h4>Select Members</h4>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}>
            {groupResults.map((user) => {
              const exists = selectedMembers.find((m) => m._id === user._id);
              return (
                <div
                  key={user._id}
                  onClick={() => {
                    if (!exists) {
                      setSelectedMembers((prev) => [...prev, user]);
                    }
                  }}
                  className="user-search-item"
                  style={{ padding: "6px" }}
                >
                  <span className="user-name" style={{ fontSize: "13px" }}>
                  {user.email}
                  </span>
                </div>
              );
            })}
          </div>

          <div>
            {selectedMembers.map((user) => (
              <span key={user._id} className="pill-badge">
                {user.name}
              </span>
            ))}
          </div>

          <div className="modal-footer-actions">
            <button onClick={() => setShowGroupModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={createGroup}
              className="btn-primary"
              style={{ width: "auto", marginBottom: 0 }}
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

}
