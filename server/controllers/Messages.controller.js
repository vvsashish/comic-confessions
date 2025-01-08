import Message from "../models/Message.model.js";

export async function getChatMessages(req, res) {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function saveChatMessages(messageObj) {
  try {
    const newMessage = new Message({
      text: messageObj.text,
      user: messageObj.user,
    });
    await newMessage.save();
    console.log("Message saved to MongoDB");
  } catch (error) {
    console.error("Error saving message to MongoDB:", error);
  }
}
