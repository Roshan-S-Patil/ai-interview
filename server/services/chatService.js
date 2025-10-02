import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const chatbot_uri = process.env.CHATBOT_URI;
export const ask = async (thread_id, messages) => {
  console.log("chatbot_uri:", thread_id, messages);
  try {
    const response = await axios.post(`${chatbot_uri}/chat/ask`, {
      thread_id,
      messages,
    });
    return successResponse(res, response.data);
  } catch (error) {
    return errorResponse(error);
  }
};
