require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./utils/db');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect Database
console.log("make sure service is start");
connectDB();

// Routes

// auth Route
app.use('/api/auth', require('./routes/auth'));
// conversation Route
app.use("/api/conversations", require("./routes/conversations"));
// messages Route
app.use("/api/messages", require("./routes/messages"));
// upload Route
// app.use("/api/upload",  require("./routes/upload"));
// userRoute
app.use("/api/user",  require("./routes/user"));

// Test route
app.get('/', (req, res) => res.send('API is running'));

// 404 route
app.use((req, res) => {
  res.status(404).json({
    msg: "Route not found"
  });
});

// Socket setup
const { setupSocket } = require("./socket/socketServer");
setupSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));   