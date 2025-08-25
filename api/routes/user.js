const express = require("express");
const {
  // getUser,
  getUsers,
  deleteUser,
  updateUser,
  savePost,
  profilePosts,
} = require("../controller/usercontroller");
const verifyToken = require("../middleware/verifytoken");
const upload = require("../middleware/upload");

const userRouter = express.Router();

userRouter.get("", getUsers);
// userRouter.get("/me", verifyToken, getUser);
// userRouter.get("/:id", verifyToken, getUser);
userRouter.put("/:id", verifyToken, updateUser);
userRouter.delete("/:id", verifyToken, deleteUser);
userRouter.post("/save", verifyToken, savePost);
userRouter.get("/profile", verifyToken, profilePosts);

module.exports = userRouter;
