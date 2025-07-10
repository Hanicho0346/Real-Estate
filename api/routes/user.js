const express = require("express");
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  updateUserAvatar,
} = require("../controller/usercontroller");
const verifyToken = require("../middleware/verifytoken");
const upload = require("../middleware/upload");

const userRouter = express.Router();

userRouter.get("", getUsers);
userRouter.get('/me', verifyToken, getUser);
userRouter.get('/:id', verifyToken, getUser);
userRouter.put("/:id", verifyToken, updateUser);
userRouter.put(
  "/:id/avatar",
  verifyToken,
  upload.single("file"),
  updateUserAvatar
);
userRouter.delete("/:id", verifyToken, deleteUser);

module.exports = userRouter;
