import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const askTextQuestion = async (payload) => {
  try {
    const response = await axios.post(`${backendUrl}/chat/ask`, payload, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  } catch (error) {
    console.error("Error exchanging code:", error);
    throw error;
  }
};
