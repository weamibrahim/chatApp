const { Server } = require('socket.io');
const User = require("../../Models/User");
const Message = require("../../Models/Message");

const socketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    cors: {
      origin: ["https://chat-app-2cap.vercel.app", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io/",
    transports: ["websocket"],
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', async (userId) => {
      socket.join(userId);
      socket.userId = userId;
      await User.findByIdAndUpdate(userId, { status: "online" });
      io.emit("updateUserStatus", { userId, status: "online" });
      console.log(`User ${userId} joined`);
    });

    socket.on('sendMessage', async (messageData) => {
      const { senderId, receiverId, message } = messageData;

      try {
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();

        // Emit the new message to the receiver
        io.to(receiverId).emit('newMessage', newMessage);
        io.to(senderId).emit('newMessage', newMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on('logout', async (userId) => {
      await User.findByIdAndUpdate(userId, { status: "offline" });
      io.emit("updateUserStatus", { userId, status: "offline" });
    });

    socket.on('disconnect', async () => {
      const userId = socket.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { status: "offline" });
        io.emit("updateUserStatus", { userId, status: "offline" });
        console.log(`User ${userId} disconnected`);
      }
    });
  });

  res.socket.server.io = io;
  res.end();
};

export default socketHandler;
