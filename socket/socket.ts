import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors"
import express from "express"

interface MessageData {
  senderId: string;
  text: string;
}

   const app = express();
    app.use(cors());
const httpServer = createServer(app);



const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000
});


const onlineUsers: Map<string, string> = new Map();


const addUser = (userId: string, socketId: string): void => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, socketId);
  }
};


const removeUser = (socketId: string): void => {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};


const getUserSocketId = (userId: string): string | undefined => {
  return onlineUsers.get(userId);
};


// In your server code
io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle authentication
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    console.log("No userId provided, disconnecting");
    socket.disconnect();
    return;
  }

  addUser(userId, socket.id);
  console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

 socket.on("sendMessage", ({ receiverId, text, chatId, messageId }: { 
  receiverId: string;
  text: string;
  chatId: string;
  messageId: string;
}) => {
  const senderId = userId; 
  
  const messageData = {
    id: messageId,
    text,
    chatId,
    senderId,
    receiverId,
    createdAt: new Date().toISOString()
  };

  const receiverSocketId = getUserSocketId(receiverId);
  
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("getMessage", messageData);
  }
  
  // Also send back to sender for sync
  socket.emit("getMessage", messageData);
});

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

