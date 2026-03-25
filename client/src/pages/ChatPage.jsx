import { useEffect } from "react";
import API from "../services/api";

export default function ChatPage() {

const userId = "69ae654f407212bde009c9ac"; // temporary test

useEffect(()=>{

API.get("/conversations/" + userId)
.then(res=>{
console.log("Conversations:",res.data);
})
.catch(err=>{
console.log(err);
});

},[]);

return(
<div>
<h2>Chat Page</h2>
</div>
);

}