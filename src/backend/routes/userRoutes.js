import express from "express";
import { getMe, getCreatedEvents, getJoinedEvents } from "../controllers/userController.js";

const router = express.Router();

// ✅ Get currently logged-in user
router.get("/me", getMe);

// ✅ Get events user joined
router.get("/:id/events/joined", getJoinedEvents);

// ✅ Get events user created
router.get("/:id/events/created", getCreatedEvents);

export default router;
