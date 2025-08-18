const prisma = require("../utils/index.js");



const getChat = async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id,
        userIds: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found or access denied" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error getting chat:", error);
    res.status(500).json({ message: "Failed to get chat" });
  }
};

const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIds: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Only get the last message for preview
        },
        users: {
          where: {
            id: {
              not: tokenUserId, // Exclude current user
            },
          },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error getting chats:", error);
    res.status(500).json({ message: "Failed to get chats" });
  }
};

const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  // Validate input
  if (!receiverId) {
    return res.status(400).json({ message: "receiverId is required" });
  }

  if (tokenUserId === receiverId) {
    return res.status(400).json({ message: "Cannot create chat with yourself" });
  }

  try {
    // Verify the receiver exists
    const receiverExists = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true }
    });

    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    // Check for existing chat (corrected query)
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { userIds: { has: tokenUserId } },
          { userIds: { has: receiverId } }
        ],
        // Alternative way to ensure it's exactly these two users
        userIds: {
          equals: [tokenUserId, receiverId].sort() // Sort to match regardless of order
        }
      },
      include: {
        users: {
          where: { id: { not: tokenUserId } },
          select: { id: true, username: true, avatar: true }
        }
      }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create new chat
    const chat = await prisma.chat.create({
      data: {
        userIds: [tokenUserId, receiverId],
        seenBy: [tokenUserId],
      },
      include: {
        users: {
          where: { id: { not: tokenUserId } },
          select: { id: true, username: true, avatar: true }
        }
      }
    });

    return res.status(201).json(chat);

  } catch (error) {
    console.error("Error creating chat:", error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({ message: "Chat already exists" });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(500).json({ 
      message: "Failed to create chat",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { id } = req.params;

  try {
    const chat = await prisma.chat.update({
      where: {
        id,
        userIds: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found or access denied" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error marking chat as read:", error);
    res.status(500).json({ message: "Failed to mark chat as read" });
  }
};

module.exports = {
  getChat,
  getChats,
  addChat,
  readChat,
};