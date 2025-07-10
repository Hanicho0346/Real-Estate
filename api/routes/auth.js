const express = require("express");
const { login, logout, register } =require( "../controller/authcontroller.js");
const verifyToken = require("../middleware/verifytoken.js");

const authrouter=express.Router()

authrouter.post("/register",register)
authrouter.post("/login",login)
authrouter.post("/logout",verifyToken,logout)


module.exports = authrouter;