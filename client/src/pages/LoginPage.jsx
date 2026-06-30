import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css"
import toast from "react-hot-toast";

export default function LoginPage(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading, setLoading] = useState(false);

const { setCurrentUser } = useContext(AuthContext);

const navigate = useNavigate();

const handleLogin = async () => {


try{

  if (!email || !password) {
  toast.error("Please fill all fields.");
  return;
}

setLoading(true)
const res = await API.post("/auth/login",{
email,
password
});

setCurrentUser(res.data.user);

localStorage.setItem("token", res.data.token);
 toast.success("Welcome back!");
navigate("/chat");

}catch(err){
  toast.error(
      err.response?.data?.msg ||
      "Login failed. Please try again."
    );
}finally {
 setLoading(false)
}

};

return (
  <div className="login-page">
    <div className="login-card">

      <h2 className="login-title">Welcome Back</h2>
      <p className="login-subtitle">
        Login to continue chatting
      </p>

      <input
        className="login-input"
        type="email"
        placeholder="Email"
         required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="login-btn"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>

      <div className="login-footer">
  Don't have an account?{" "}
  <Link to="/register">Register</Link>
</div>

    </div>
  </div>
);

}