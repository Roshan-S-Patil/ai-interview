import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getUserApi = async () => {
  try {
    const response = await axios.get(`${backendUrl}/auth/users`, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const googleVerificationApi = async (code, redirect_uri) => {
  try {
    const response = await axios.post(
      `${backendUrl}/auth/google`,
      { code, redirect_uri: redirect_uri },
      {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error exchanging code:", error);
    throw error;
  }
};
