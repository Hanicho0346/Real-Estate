const prisma = require("../utils/index.js");

const addMessage = async (req, res) => {
  const { chatId } = req.params;
  const { text } = req.body;
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIds: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found or access denied" });
    }

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

module.exports = { addMessage }; 