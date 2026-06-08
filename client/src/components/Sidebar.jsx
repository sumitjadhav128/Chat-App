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

return(

<div style={{
width:"300px",
borderRight:"1px solid #ccc",
padding:"10px"
}}>

<input
type="text"
placeholder="Search users..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
width:"100%",
padding:"8px",
marginBottom:"10px"
}}
/>

{/* // render result */}
{results.map(user=>(

<div
key={user._id}
onClick={()=>startChat(user)}
style={{
padding:"8px",
cursor:"pointer",
borderBottom:"1px solid #eee"
}}
>

<div>{user.name}</div>

<div style={{
fontSize:"12px",
color:"gray"
}}>
{user.email}
</div>

</div>

))}

{/* <button onClick={startChat}>
Start Chat
</button> */}

<button
onClick={()=>setShowGroupModal(true)}
>
+ Create Group
</button>

<h3>Chats</h3>

{conversations.map((conv)=>{

const otherUser = conv.members.find(
member =>
String(member._id) !== String(currentUser._id)
);

const isOnline = onlineUsers.some(
user =>
String(user.userId) === String(otherUser?._id)
);

return(

<div
key={conv._id}
onClick={()=>setCurrentChat(conv)}
style={{
padding:"10px",
borderBottom:"1px solid #eee",
cursor:"pointer"
}}
>

<div>

{/* CHAT NAME */}

<div>

{conv.isGroup
? conv.groupName || "Group Chat"
: otherUser?.name || otherUser?.email || "User"}

</div>

{/* ONLINE STATUS */}

{!conv.isGroup && (

<div style={{
fontSize:"12px",
color:isOnline ? "green" : "gray"
}}>

{isOnline ? "● Online" : "Offline"}

</div>

)}

</div>

</div>

);

})
}
 
 {/* // group creation */}
{showGroupModal && (

<div style={{
position:"fixed",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
background:"white",
padding:"20px",
border:"1px solid #ccc",
borderRadius:"8px",
maxHeight: "200px",
overflowY: "auto",
zIndex:1000

}}>

<h3>Create Group</h3>

<input
  type="text"
  placeholder="Group Name"
  value={groupName}
  onChange={(e) => setGroupName(e.target.value)}
/>

<input
  type="text"
  placeholder="Search members..."
  value={groupSearch}
  onChange={(e) => setGroupSearch(e.target.value)}
/>

<h4>Select Members</h4>

{groupResults.map(user => (

  <div
    key={user._id}
    onClick={() => {

      const exists = selectedMembers.find(
        m => m._id === user._id
      );

      if (!exists) {
        setSelectedMembers(prev => [...prev, user]);
      }

    }}
    style={{
      padding: "5px",
      cursor: "pointer"
    }}
  >

    {user.name} ({user.email})

  </div>

))}

<div>

  {selectedMembers.map(user => (

    <span
      key={user._id}
      style={{
        margin: "5px",
        padding: "5px",
        border: "1px solid #ccc"
      }}
    >
      {user.name}
    </span>

  ))}

</div>

<button onClick={createGroup}>
Create Group
</button>

<button
onClick={()=>
setShowGroupModal(false)
}
>
Cancel
</button>

</div>

)}

</div>

);

}
