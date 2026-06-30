import { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast";

 export default function  RegisterPage() {
    const [form, setForm] = useState(
        {
            name:"",
            email:"",
            password: ""
        }
    )
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
    setForm(
        {
            ...form,
            [e.target.name]: e.target.value
        }
    )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

       try {
        setLoading(true)
         const response = await fetch("https://chat-app-gr95.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
        });

        const data = await response.json();
       
        if(data.token) {
           localStorage.setItem("token", data.token)
            navigate("/login");
        } else {
            // alert(data.message)
             toast.error(data.msg || "Registration failed.");
        }
       } catch(error) {
         toast.error(
    error.response?.data?.msg ||
    error.response?.data?.msg ||
    error.msg ||
    "Registration failed. Please try again."
  );
       }
     finally {
    setLoading(false)
    } }

  return (
  <div className="login-page">
    <div className="login-card">

      <h2 className="login-title">Create Account</h2>

      <p className="login-subtitle">
        Join the conversation and start chatting
      </p>

      <form onSubmit={handleSubmit}>

        <input
          className="login-input"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          className="login-input"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          className="login-input"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button
          className="login-btn"
          type="submit"
        >
          { loading ? "..." : "Register"}
        </button>

      </form>

      <div className="login-footer">
        Already have an account?
       {" "}
  <Link to="/login">Login</Link>
      </div>

    </div>
  </div>
);
}