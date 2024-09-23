const socketIO = require('socket.io');
const User = require('./Models/User'); 
const Message = require('./Models/Message'); 

module.exports = function (server) {
  const io = socketIO(server, {
    cors: {
      origin: "*", 
    }
  });
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', async (userId) => {
      socket.join(userId);
      console.log(`User with id ${userId} joined the room`);
      socket.userId = userId;
      await User.findByIdAndUpdate(userId, { status: "online" });
      io.emit('updateUserStatus', { userId, status: "online" });
    });

   

    socket.on('sendMessage', async (messageData) => {
      try {
        const { senderId, receiverId, message } = messageData;
        console.log('Message data received:', messageData); // Log received data
        
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();
        console.log('Message saved:', newMessage); // Log message after saving
    
        io.to(senderId).emit('newMessage', newMessage);
        io.to(receiverId).emit('newMessage', newMessage);
      } catch (error) {
        console.error('Error saving message:', error); // Log error
      }
    });
    

    socket.on('logout', async (userId) => {
      await User.findByIdAndUpdate(userId, { status: "offline" });
      io.emit('updateUserStatus', { userId, status: "offline" });
    })

    // Handle user disconnect
    socket.on('disconnect', async () => {
      const userId = socket.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { status: "offline" });
        io.emit('updateUserStatus', { userId, status: "offline" });
      }
    });
  });

  return io;
};
