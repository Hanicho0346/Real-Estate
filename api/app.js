const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth.js");
const testRouter = require("./routes/test.js");
const postRouter = require("./routes/post.js");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chat.js");
const messageRouter = require("./routes/message.js");

const app = express();
const server = http.createServer(app);

// Middleware setup remains the same
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/chats", chatRouter);
app.use("/api/message", messageRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});



const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
