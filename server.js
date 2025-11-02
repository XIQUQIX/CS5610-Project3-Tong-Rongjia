import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/backend/routes/authRoutes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running on http://localhost:${process.env.PORT}`);
});
