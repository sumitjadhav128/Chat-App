require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./utils/db');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

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

// Test route
app.get('/', (req, res) => res.send('API is running'));

// Socket setup
const setupSocket = require('./socket/socketServer');
setupSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));   