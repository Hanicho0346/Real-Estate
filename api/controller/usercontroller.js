const prisma = require("../utils/index.js");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { username: true, email: true, id: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Failed to get user:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to get user" });
  }
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const body = req.body;
  if (id != tokenUserId) {
    res.status(403).json({ message: "not autheticated" });
  }
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to get user" });
  }
};

const updateUserAvatar = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      upload_preset: "profile_pictures",
    });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { avatar: result.secure_url },
    });

    const { password, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, email, username } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { 
        username: true, 
        email: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const dataToUpdate = {
      ...(username !== undefined && 
          username !== null && 
          username.trim() !== "" && 
          username !== currentUser.username && { username }),
      ...(email !== undefined && 
          email !== null && 
          email.trim() !== "" && 
          email !== currentUser.email && { email }),
      ...(password && password.length > 0 && { 
        password: await bcrypt.hash(password, 10) 
      }),
    };

    
    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key] === undefined) {
        delete dataToUpdate[key];
      }
    });

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(200).json({ message: "No changes detected." });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        username: true,
        email: true,
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(", ")
        : error.meta?.target;
      return res.status(400).json({ message: `The ${target} is already taken.` });
    } else if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(500).json({
      message: "Failed to update user due to an internal server error.",
      error: error.message
    });
  }
};
module.exports = {
  updateUser,
  deleteUser,
  getUsers,
  getUser,
  updateUserAvatar,
};
