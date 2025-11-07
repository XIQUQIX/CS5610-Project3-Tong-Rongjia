import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config();

const app = express();
app.use(express.json());

// Manually
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  // res.header('Access-Control-Allow-Origin', 'https://huskyhub.netlify.app/');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use("/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on http://0.0.0.0:${process.env.PORT}`);
});
