const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/index.js");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, email, password, avatar = "" } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashpassword,
        avatar,
      },
    });

    const { password: _, ...userData } = user;

    res.status(201).json({
      message: "User created successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "P2002") {
      const target = error.meta?.target;
      let message = "Registration failed";

      if (target.includes("username")) {
        message = "Username already exists";
      } else if (target.includes("email")) {
        message = "Email already exists";
      }

      return res.status(400).json({ message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors 
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
        avatar: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        errors: { username: "Username not found" } 
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        errors: { password: "Incorrect password" } 
      });
    }

    const tokenAge = 24 * 60 * 60 * 1000;

    if (!process.env.JWT_KEY_TOKEN) {
      throw new Error("JWT secret key is not configured");
    }

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_KEY_TOKEN,
      { expiresIn: tokenAge }
    );

    const { password: _, ...userInfo } = user;
    
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: tokenAge, 
        sameSite: "none",
        secure: false
      })
      .status(200) 
      .json({
        message: "Login successful",
        token,
        user: userInfo
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  res
    .clearCookie("token", {
      sameSite: "none",
      secure: false,
    })
    .status(200)
    .json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  logout,
};
