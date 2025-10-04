import { ask } from "../services/chatService.js";
export const askController = async (req, res) => {
  const { thread_id, messages } = req.body;
  try {
    const serviceResponse = await ask(thread_id, messages);
    console.log("Service Response:", serviceResponse);
    return res.status(200).json(serviceResponse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
