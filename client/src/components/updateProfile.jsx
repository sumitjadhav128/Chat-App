import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UpdateProfile() {

  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    avatar: currentUser?.avatar || ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/user/updateProfile",
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(form)
  }
);

      const data = await response.json();

      if (!response.ok) {
  // all error cases come here
  alert(data.msg || "Request failed");
  return;
}

console.log("Updated user:", data);
alert("Profile updated successfully");
setForm(prev => ({
  ...prev,
  avatar: data.avatar || ""
}));

// set globally
setCurrentUser(data)

    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>

        <input
          name="avatar"
          placeholder="change avatar"
          onChange={handleChange}
          value={form.avatar || ""}
        />

        <button type="submit">submit</button>
      </form>

      <label>{form.avatar || ""}</label>
    </>
  );
}