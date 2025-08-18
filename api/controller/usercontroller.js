const prisma = require("../utils/index.js");
const bcrypt = require("bcrypt");

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

const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  if (!tokenUserId) {
    return res.status(403).json({ message: "not authenticated" });
  }

  try {
    const deleteResult = await prisma.savePosts.deleteMany({
      where: {
        userId: tokenUserId,
        postId: postId,
      },
    });

    if (deleteResult.count > 0) {
      return res.status(200).json({ message: "post removed from saved" });
    }

    await prisma.savePosts.create({
      data: {
        userId: tokenUserId,
        postId: postId,
      },
    });

    return res.status(200).json({ message: "post saved successfully" });
  } catch (error) {
    console.log(error);
    if (error.code === "P2025") {
      await prisma.savePosts.create({
        data: {
          userId: tokenUserId,
          postId: postId,
        },
      });
      return res.status(200).json({ message: "post saved successfully" });
    }
    return res.status(500).json({ message: "failed to save/unsave post" });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, email, username, avatar } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: {
        username: true,
        email: true,
        avatar: true,
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
      ...(avatar !== undefined &&
        avatar !== null &&
        avatar.trim() !== "" &&
        avatar !== currentUser.avatar && { avatar }),
      ...(password &&
        password.length > 0 && {
          password: await bcrypt.hash(password, 10),
        }),
    };

    // Rest of your update logic remains the same...
    Object.keys(dataToUpdate).forEach((key) => {
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
        avatar: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(", ")
        : error.meta?.target;
      return res
        .status(400)
        .json({ message: `The ${target} is already taken.` });
    } else if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(500).json({
      message: "Failed to update user due to an internal server error.",
      error: error.message,
    });
  }
};
const profilePosts = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    console.log("Fetching profile for user ID:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPosts = await prisma.post.findMany({
      where: { userId },
      select: {
        id: true,
        price: true,
        bedroom: true,
        bathroom: true,
        address: true,
        city: true,
        type: true,
        property: true,
        createdAt: true,
        images: true,
        savePosts: {
          where: { userId },
          select: { id: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 5 
    });
    const existingSavedPosts = await prisma.savePosts.findMany({
      where: { 
        userId,
        post: {  
          id: { not: undefined }
        }
      },
      select: {
        postId: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    const savedPostsData = await Promise.all(
      existingSavedPosts.map(async ({ postId, createdAt }) => {
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: {
            id: true,
            price: true,
            bedroom: true,
            bathroom: true,
            address: true,
            city: true,
            type: true,
            property: true,
            createdAt: true,
            images: true,
            savePosts: {
              where: { userId },
              select: { id: true }
            }
          }
        });
        return { post, createdAt };
      })
    );

    const transformedUserPosts = userPosts.map(post => ({
      ...post,
      image: post.images?.[0] || null,
      isSaved: post.savePosts.length > 0,
      savePosts: undefined,
      postDetail: undefined
    }));

    const transformedSavedPosts = savedPostsData
      .filter(item => item.post !== null)
      .map(({ post, createdAt: savedAt }) => ({
        ...post,
        savedAt,
        isSaved: true,
        image: post.images?.[0] || null,
        savePosts: undefined,
        postDetail: undefined
      }));

    const response = {
      user,
      userPosts: transformedUserPosts,
      savedPosts: transformedSavedPosts
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in profilePosts:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
module.exports = {
  updateUser,
  deleteUser,
  getUsers,
  savePost,
  profilePosts,
};
