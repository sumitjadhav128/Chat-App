import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const { setCurrentUser } = useContext(AuthContext);

const navigate = useNavigate();

const handleLogin = async () => {

try{

const res = await API.post("/auth/login",{
email,
password
});

setCurrentUser(res.data.user);

navigate("/chat");

}catch(err){
console.log(err);
}

};

return(

<div>

<h2>Login</h2>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={handleLogin}>
Login
</button>

</div>

);

}