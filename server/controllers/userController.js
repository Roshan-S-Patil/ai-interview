import { success, error } from "../utils/HTTPResponse.js";
import { generateToken } from "../services/jwtauth.js";
import { createUser, getUser } from "../services/userService.js";
import { User } from "../models/user.js";

export const googleAuth = async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    if (!code || !redirect_uri) {
      return res
        .status(400)
        .json({ message: "Code and redirect_uri are required" });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return res
        .status(400)
        .json({ message: "Error exchanging code", error: tokenData.error });
    }

    // Fetch user info
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );
    const userInfo = await userInfoResponse.json();
    if (userInfo.error) {
      return res
        .status(400)
        .json({ message: "Error fetching user info", error: userInfo.error });
    }
    const user = await getUser(userInfo.sub);
    console.log("User from DB:", user);
    if (user?.success && user?.data) {
      // User exists, generate tokens
      const access_token = await generateToken(user?.data);
      if (!access_token) {
        return res.status(500).json({ message: "Error generating tokens" });
      }
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
        sameSite: "Lax",
      });
      console.log("User already exists. Logged in.", user?.data);
      res.status(200).json({
        data: user?.data,
        message: "Authentication successful",
      });
      return;
    }
    const serviceResponse = await createUser(userInfo);
    if (!serviceResponse.success) {
      return res.status(500).json({ message: "Error creating user in DB" });
    }

    const access_token = await generateToken(serviceResponse?.data);
    if (!access_token) {
      return res.status(500).json({ message: "Error generating tokens" });
    }
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
      sameSite: "Lax",
    });
    // res.cookie("refresh_token", refresh_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 7 * 24 * 3600000, // 7 days
    //   sameSite: "Lax",
    // });
    res.status(200).json({
      data: serviceResponse?.data,
      message: "Authentication successful",
    });
  } catch (error) {
    res.status(500).json(null, { message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const serviceResponse = await getUser(req.sub);
    if (!serviceResponse?.success) {
      return res.status(500).json({ message: "Error fetching users" });
    }
    const user = serviceResponse?.data;
    res.status(200).json({ data: user, message: "Users fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    // res.clearCookie("refresh_token", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Lax",
    // });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
