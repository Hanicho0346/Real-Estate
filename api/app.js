const express = require("express");
const path = require('path');
const cookieParser = require("cookie-parser");
const authrouter = require("./routes/auth.js");
const testrouter = require("./routes/test.js");
const postRouter = require("./routes/post.js");
const cors = require("cors");
const userRouter = require("./routes/user.js");
const app = express();
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authrouter);
app.use("/api/test", testrouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(8800, () => {
  console.log("server is running");
});
