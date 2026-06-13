// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// export default API;

// for search query
import axios from "axios";

const API = axios.create({
  // baseURL: "http://192.168.59.196:5000/api",
  baseURL: "https://chat-app-gr95.onrender.com/api"
});

API.interceptors.request.use((req)=>{

const token = localStorage.getItem("token");

if(token){

req.headers.Authorization = `${token}`;

}

return req;

});

export default API;