import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/backend/routes/authRoutes.js"
import eventRoutes from "./src/backend/routes/eventRoutes.js"
import userRoutes from "./src/backend/routes/userRoutes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running on http://localhost:${process.env.PORT}`);
});
