const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join_room", ({ roomId, user }) => {
    socket.join(roomId);

    socket.to(roomId).emit("user_joined", user);
  });

  // CHAT
  socket.on("send_message", ({ roomId, message }) => {
    io.to(roomId).emit("receive_message", message);
  });

  // CODE SYNC
  socket.on("code_change", ({ roomId, code }) => {
    socket.to(roomId).emit("code_update", code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => console.log("Socket server running on 5000"));