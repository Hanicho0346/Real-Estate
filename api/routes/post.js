const express = require("express");
const { getPost, getPosts, updatePosts,deletePosts,addPosts } =require( "../controller/postcontroller.js");
const verifyToken = require("../middleware/verifytoken.js");

const postRouter=express.Router()

postRouter.get("",getPosts)
postRouter.get("/:id",getPost)
postRouter.post("/addpost",verifyToken,addPosts)
postRouter.put("/:id",verifyToken,updatePosts)
postRouter.delete("/:id",deletePosts);

module.exports=postRouter