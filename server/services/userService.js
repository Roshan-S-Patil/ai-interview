import { User } from "../models/user.js";
import { success, error } from "../utils/serviceResponse.js";
export const createUser = async (userData) => {
  const { sub, name, picture, email } = userData;
  try {
    const user = new User({
      googleId: sub,
      name,
      profilePicture: picture,
      email,
    });
    const savedUser = await user.save();
    return success(savedUser, "User created successfully");
  } catch (err) {
    return error(null, err.message);
  }
};

export const getUser = async (sub) => {
  try {
    const user = await User.findOne({ googleId: sub });
    if (!user) {
      return error(null, "User not found");
    }
    return success(user, "User fetched successfully");
  } catch (err) {
    return error(null, err.message);
  }
};

// User can access profile page only if that profile page is his own or profile is public or he is a friend
// this is the json to store the permissions
