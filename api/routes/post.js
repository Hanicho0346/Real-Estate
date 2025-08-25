const express = require("express");
const multer=require("multer")
const {
  getPost,
  getPosts,
  updatePosts,
  deletePosts,
  addPosts,
} = require("../controller/postcontroller.js");
const verifyToken = require("../middleware/verifytoken.js");

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});
const postRouter = express.Router();

postRouter.get("/posts", getPosts);
postRouter.get("/:id", getPost);
postRouter.post("/addpost", verifyToken, upload.array("images"), addPosts);
postRouter.put("/:id", verifyToken, updatePosts);
postRouter.delete("/:id", deletePosts);

module.exports = postRouter;
