import express from "express";
import { askController } from "../controllers/chatController.js";

const router = express.Router();
router.post("/ask", askController);

export default router;
