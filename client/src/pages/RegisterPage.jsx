import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
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

        const response = await fetch("http://localhost:5000/api/auth/register", {
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
    <>
    <form onSubmit={handleSubmit}>
<input name='name' placeholder='Name' onChange={handleChange} />
<input name='email' placeholder='Email' onChange={handleChange} />
<input name='password' type='password' placeholder='Password' onChange={handleChange} />
<button type='submit'>Regester</button>
    </form>
    </>
  )
}

export default RegisterPage