const prisma = require("../utils/index.js");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const uploadImages = async (files, postId) => {
  if (!files || files.length === 0) return [];

  const uploadDir = path.join(__dirname, "../uploads", postId);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const imageUrls = await Promise.all(
    files.map(async (file) => {
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, file.buffer);

      return `/uploads/${postId}/${fileName}`;
    })
  );

  return imageUrls;
};

const getPosts = async (req, res) => {
  try {
    const {
      type,
      location,
      propertyType,
      minPrice,
      maxPrice,
      bedroom,
      bathroom,
    } = req.query;

    const where = {};

    if (type) where.type = type.toLowerCase();

    if (location) {
      where.address = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (propertyType) where.property = propertyType.toLowerCase();

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice && !isNaN(minPrice)) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(maxPrice)) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    if (bedroom && !isNaN(bedroom)) {
      where.bedroom = { gte: Number(bedroom) };
    }

    if (bathroom && !isNaN(bathroom)) {
      where.bathroom = { gte: Number(bathroom) };
    }

    console.log("WHERE clause:", JSON.stringify(where, null, 2));

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to get posts:", error);
    res.status(500).json({
      message: "Failed to get posts",
      error: error.message,
    });
  }
};

const getPost = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Post ID is required" });
  }
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let userId = null;
    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_KEY_TOKEN);
        userId = payload.id;
      } catch (err) {
        userId = null;
      }
    }

    let isSaved = false;
    if (userId) {
      const savedPost = await prisma.savePosts.findUnique({
        where: {
          userId_postId: {
            postId: id,
            userId: userId,
          },
        },
      });
      isSaved = !!savedPost;
    }

    res.status(200).json({ ...post, isSaved });
  } catch (error) {
    console.error("Failed to get post:", error);
    res
      .status(500)
      .json({ message: "Failed to get post", error: error.message });
  }
};

const addPosts = async (req, res) => {
  try {
    const { postData, postDetail, images } = req.body;
    const tokenId = req.userId;

    if (!postData || !postData.Title || !postData.price || !postData.address || !postData.city) {
      return res.status(400).json({
        message: "Missing required fields: Title, price, address, and city are required",
      });
    }

    const validTypes = ["buy", "rent"];
    const validProperties = ["apartment", "house", "villa", "condo", "townhouse"];

    if (!validTypes.includes(postData.type)) {
      return res.status(400).json({
        message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    const propertyType = postData.property.toLowerCase();
    if (!validProperties.includes(propertyType)) {
      return res.status(400).json({
        message: `Invalid property type. Must be one of: ${validProperties.join(", ")}`,
      });
    }

    const newPost = await prisma.post.create({
      data: {
        Title: postData.Title,
        price: postData.price.toString(),
        address: postData.address,
        bedroom: parseInt(postData.bedroom) || 0,
        bathroom: parseInt(postData.bathroom) || 0,
        city: postData.city,
        type: postData.type.toLowerCase(),
        property: propertyType,
        images: images || [],
        userId: tokenId,
        ...(postDetail && {
          postDetail: {
            create: {
              des: postDetail.des || "",
              utilities: postDetail.utilities || "",
              pet: postDetail.pet || "Not specified",
              income: postDetail.income || "Not specified",
              size: parseInt(postDetail.size) || 0,
              school: parseInt(postDetail.school) || 0,
              bus: parseInt(postDetail.busDistance) || 0,
              restaurant: parseInt(postDetail.restaurants) || 0,
            },
          },
        }),
      },
    });

    const completePost = await prisma.post.findUnique({
      where: { id: newPost.id },
      include: { postDetail: true },
    });

    return res.status(201).json({
      success: true,
      post: completePost,
    });
  } catch (error) {
    console.error("Post creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updatePosts = async (req, res) => {
  const id = req.params.id;
  const { postDetail, ...restOfBody } = req.body;
  const tokenId = req.userId;
  const files = req.files;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.userId !== tokenId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    let imageUrls = existingPost.images || [];
    if (files && files.length > 0) {
      if (existingPost.images && existingPost.images.length > 0) {
        const uploadDir = path.join(__dirname, "../uploads", id);
        if (fs.existsSync(uploadDir)) {
          fs.rmSync(uploadDir, { recursive: true });
        }
      }

      imageUrls = await uploadImages(files, id);
    }

    const postUpdateData = { ...restOfBody };
    if (postUpdateData.userId) {
      delete postUpdateData.userId;
    }

    const updateData = {
      ...postUpdateData,
      images: imageUrls,
      ...(postDetail &&
      typeof postDetail === "object" &&
      existingPost.postDetail
        ? {
            postDetail: {
              update: postDetail,
            },
          }
        : postDetail &&
          typeof postDetail === "object" &&
          !existingPost.postDetail
        ? {
            postDetail: {
              create: postDetail,
            },
          }
        : {}),
    };

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    if (error.code === "P2000") {
      return res.status(400).json({ message: "Invalid input data" });
    }
    res.status(500).json({ message: "Failed to update post" });
  }
};

const deletePosts = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;

  try {
    const postToDelete = await prisma.post.findUnique({
      where: { id },
    });

    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (postToDelete.userId !== tokenId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    const uploadDir = path.join(__dirname, "../uploads", id);
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

module.exports = {
  addPosts,
  getPosts,
  getPost,
  deletePosts,
  updatePosts,
};
