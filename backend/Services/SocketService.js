// services/socketService.js
let io;

const init = (httpServer) => {
  const { Server } = require("socket.io");
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
    // Tune for your infra:
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    // Fan joins a specific match room
    socket.on("join_match", (matchId) => {
      socket.join(`match:${matchId}`);
    });

    socket.on("leave_match", (matchId) => {
      socket.leave(`match:${matchId}`);
    });

    socket.on("disconnect", () => {
      // Socket.IO auto-cleans rooms on disconnect
    });
  });

  return io;
};

// Called by liveScoreService after every admin update
const emitMatchUpdate = (matchId, payload) => {
  if (!io) return;
  io.to(`match:${matchId}`).emit("match_update", payload);
};

const emitNewEvent = (matchId, event) => {
  if (!io) return;
  io.to(`match:${matchId}`).emit("match_event", event);
};

module.exports = { init, emitMatchUpdate, emitNewEvent };
