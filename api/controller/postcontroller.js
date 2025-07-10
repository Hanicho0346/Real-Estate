const prisma = require("../utils/index.js");

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "failed to get posts" });
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
    console.log(error);
    res.status(500).json({ message: "failed to get posts" });
  }
};
const updatePosts = async (req, res) => {
  const id = req.params.id; // ID of the post to update
  const { postDetail, ...restOfBody } = req.body; // Destructure postDetail from the body
  const tokenId = req.userId; // ID of the authenticated user

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true }, // Include postDetail to check if it exists
    });

    // if (!existingPost) {
    //   return res.status(404).json({ message: "Post not found" });
    // }

    // // Authorization check: Only the owner can update
    // if (existingPost.userId !== tokenId) {
    //   return res
    //     .status(403)
    //     .json({ message: "Not authorized to update this post" });
    // }

    // Prepare data for the Post update
    // Exclude userId from the `restOfBody` if it was somehow sent in the request
    const postUpdateData = { ...restOfBody };
    if (postUpdateData.userId) {
        delete postUpdateData.userId; // Prevent userId from being updated via API
    }


    // Build the Prisma update data object
    const updateData = {
      ...postUpdateData, // Apply updates to direct Post fields

      // Handle nested postDetail update
      ...(postDetail && typeof postDetail === 'object' && existingPost.postDetail
        ? { // If postDetail exists in body AND in existing post
            postDetail: {
              update: postDetail // Update the existing related record
            }
          }
        : postDetail && typeof postDetail === 'object' && !existingPost.postDetail
        ? { // If postDetail exists in body but not in existing post (create it)
            postDetail: {
                create: postDetail
            }
          }
        : {} 
      ),
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
            }
        }
      }
    });

    res.status(200).json(updatedPost);

  } catch (error) {
    console.error("Error updating post:", error);
    // Prisma validation errors (e.g., P2000 for too long string) can also occur here
    if (error.code === 'P2000') {
      return res.status(400).json({ message: "Invalid input data: some field is too long or malformed." });
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

    // if (postToDelete.userId !== tokenId) {
    //   return res
    //     .status(403)
    //     .json({ message: "Not authorized to delete this post" });
    // }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
const addPosts = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenId = req.userId;


  if (!postData || !postData.Title || !postData.price || !postData.address || !postData.city) {
    return res.status(400).json({
      message: "Missing required fields: Title, price, address, and city are required"
    });
  }


  const validTypes = ['buy', 'sell', 'rent'];
  const validProperties = ['Apartment', 'house', 'land', 'condominum'];
  
  if (!validTypes.includes(postData.type)) {
    return res.status(400).json({
      message: `Invalid type. Must be one of: ${validTypes.join(', ')}`
    });
  }

  if (!validProperties.includes(postData.property)) {
    return res.status(400).json({
      message: `Invalid property type. Must be one of: ${validProperties.join(', ')}`
    });
  }

  try {
    const postDataForPrisma = {
      Title: postData.Title,
      price: postData.price.toString(), 
      images: postData.images || [], 
      address: postData.address,
      bedroom: Number(postData.bedroom) || 0,
      bathroom: Number(postData.bathroom) || 0,
      city: postData.city,
      latitude: postData.latitude?.toString() || '0',
      longitude: postData.longitude?.toString() || '0',
      type: postData.type,
      property: postData.property,
      userId: tokenId 
    };

    const newPost = await prisma.post.create({
      data: {
        ...postDataForPrisma,
        ...(postDetail && {
          postDetail: {
            create: {
              des: postDetail.des || '',
              utilities: postDetail.utilities || '',
              pet: postDetail.pet || 'Not specified',
              income: postDetail.income || 'Not specified',
              size: Number(postDetail.size) || 0,
              school: Number(postDetail.school) || 0,
              bus: Number(postDetail.bus) || 0,
              restaurant: Number(postDetail.restaurant) || 0
            }
          }
        })
      },
      include: {
        postDetail: true
      }
    });

    return res.status(201).json({
      success: true,
      post: newPost
    });

  } catch (error) {
    console.error('Post creation error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: "Unique constraint violation"
      });
    }

    if (error.code === 'P2023') {
      return res.status(400).json({
        success: false,
        message: "Invalid ObjectId format"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
module.exports = {
  addPosts,
  getPosts,
  getPost,
  deletePosts,
  updatePosts,
};
