import { io } from "socket.io-client";

const socket = io("http://192.168.59.196:5000");

export default socket;