import express from "express";
import { googleAuth, getUsers, logout } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/google", googleAuth);
router.get("/users", authMiddleware, getUsers);
router.post("/logout", authMiddleware, logout);
// router.post("/users", createUser);
export default router;
