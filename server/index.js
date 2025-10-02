import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://www.roshanpatil.com", "https://roshanpatil.com"], // must match exactly, no trailing slash
    credentials: true, // required for cookies
    methods: ["GET", "POST", "OPTIONS"], // wildcard "*" won't work
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use("/auth", userRoute);
app.use("/chat", chatRoute);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, "dist")));

app.get(/.*/, (req, res) => {
  // Catch-all last
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
