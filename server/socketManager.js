let io;

const setIO = (serverIO) => {
  io = serverIO;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { setIO, getIO };