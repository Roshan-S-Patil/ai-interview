import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const signJWT = (payload) => {
  const secret = process.env.JWT_SECRET;
  try {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
  } catch (err) {
    return null;
  }
};

export const generateToken = async (user) => {
  try {
    const payload = {
      _id: user._id.toString(),
      sub: user.googleId.toString(),
      email: user.email,
    };
    return signJWT(payload);
  } catch (error) {
    console.error("Error generating token:", error);
  }
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export const refreshToken = async (token) => {
  try {
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("User not found");
    }
    return await generateToken(user);
  } catch (err) {
    throw new Error("Invalid token");
  }
};
