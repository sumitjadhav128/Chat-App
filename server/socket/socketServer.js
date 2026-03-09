function setupSocket(server) {
  const io = require('socket.io')(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('New user connected', socket.id);

    // User comes online
    socket.on('user-online', (userId) => {
      socket.userId = userId;
      io.emit('user-online', userId);
    });

    // User disconnects
    socket.on('disconnect', () => {
      if (socket.userId) io.emit('user-offline', socket.userId);
      console.log('User disconnected', socket.id);
    });
  });

  return io;
}

module.exports = setupSocket;