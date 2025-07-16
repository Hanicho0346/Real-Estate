const prisma = require("../utils/index.js");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

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
    const { city, type, property, minPrice, maxPrice, minBed, maxBed } =
      req.query;

    const where = {};

    if (city) where.city = { contains: city, mode: "insensitive" };
    if (type) where.type = type;
    if (property) where.property = property;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (minBed || maxBed) {
      where.bedroom = {};
      if (minBed) where.bedroom.gte = parseInt(minBed);
      if (maxBed) where.bedroom.lte = parseInt(maxBed);
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to get posts:", error);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

const getPost = async (req, res) => {
  const id = req.params.id;

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

    res.status(200).json(post);
  } catch (error) {
    console.error("Failed to get post:", error);
    res.status(500).json({ message: "Failed to get post" });
  }
};

const addPosts = async (req, res) => {
  try {
    const postData = req.body.postData;
    const postDetail = req.body.postDetail;
    const tokenId = req.userId;
    const files = req.files;
    const parsedPostData =
      typeof postData === "string" ? JSON.parse(postData) : postData;
    const parsedPostDetail = postDetail
      ? typeof postDetail === "string"
        ? JSON.parse(postDetail)
        : postDetail
      : null;

    if (
      !parsedPostData ||
      !parsedPostData.Title ||
      !parsedPostData.price ||
      !parsedPostData.address ||
      !parsedPostData.city
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: Title, price, address, and city  are required",
      });
    }

    const validTypes = ["buy", "sell", "rent"];
    const validProperties = ["apartment", "house", "land", "condominum"];

    if (!validTypes.includes(parsedPostData.type)) {
      return res.status(400).json({
        message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    const propertyType = parsedPostData.property.toLowerCase();
    if (!validProperties.includes(propertyType)) {
      return res.status(400).json({
        message: `Invalid property type. Must be one of: ${validProperties.join(
          ", "
        )}`,
      });
    }

    const newPost = await prisma.post.create({
      data: {
        Title: parsedPostData.Title,
        price: parsedPostData.price.toString(),
        address: parsedPostData.address,
        bedroom: parseInt(parsedPostData.bedroom) || 0,
        bathroom: parseInt(parsedPostData.bathroom) || 0,
        city: parsedPostData.city,
        type: parsedPostData.type.toLowerCase(),
        property: propertyType,
        userId: tokenId,
        ...(parsedPostDetail && {
          postDetail: {
            create: {
              des: parsedPostDetail.des || "",
              utilities: parsedPostDetail.utilities || "",
              pet: parsedPostDetail.pet || "Not specified",
              income: parsedPostDetail.income || "Not specified",
              size: parseInt(parsedPostDetail.size) || 0,
              school: parseInt(parsedPostDetail.school) || 0,
              bus: parseInt(parsedPostDetail.busDistance) || 0,
              restaurant: parseInt(parsedPostDetail.restaurants) || 0,
            },
          },
        }),
      },
    });

    let imageUrls = [];
    if (files && files.length > 0) {
      try {
        imageUrls = await uploadImages(files, newPost.id);
        await prisma.post.update({
          where: { id: newPost.id },
          data: { images: imageUrls },
        });
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        await prisma.post.delete({ where: { id: newPost.id } });
        throw uploadError;
      }
    }

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
