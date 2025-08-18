const verifyToken = require("./../middleware/verifytoken");
const express = require("express");
const { addMessage } = require("./../controller/messagecontroller");
const messageRouter = express.Router();

messageRouter.post("/:chatId", verifyToken, addMessage);


module.exports=messageRouter;