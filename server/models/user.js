import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    profilePicture: { type: String },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
