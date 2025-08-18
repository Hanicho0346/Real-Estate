const verifyToken = require("./../middleware/verifytoken");
const express = require("express");
const {
  getChat,
  getChats,
  addChat,
  readChat,
} = require("./../controller/chatcontroller");
const chatRouter = express.Router();

chatRouter.use(verifyToken);

chatRouter.get("/", getChats);

chatRouter.get("/:id", getChat);
chatRouter.post("/", addChat);

chatRouter.put("/:id/read", readChat);

module.exports = chatRouter;