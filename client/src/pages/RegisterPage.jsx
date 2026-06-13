import { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
 function RegisterPage() {
    const [form, setForm] = useState(
        {
            name:"",
            email:"",
            password: ""
        }
    )

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
            alert(data.message)
        }
    }
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
        />

        <input
          className="login-input"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
        />

        <input
          className="login-input"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button
          className="login-btn"
          type="submit"
        >
          Register
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

export default RegisterPage