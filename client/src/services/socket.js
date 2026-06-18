import { io } from "socket.io-client";

const socket = io("https://chat-app-gr95.onrender.com");

export default socket;