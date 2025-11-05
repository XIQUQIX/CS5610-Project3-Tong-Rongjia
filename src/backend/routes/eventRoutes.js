import express from "express";
import { getEvents, createEvent, joinEvent, getEventById, updateEvent, deleteEvent } from "../controllers/eventController.js";

const router = express.Router();

// GET /api/events 
router.get("/", getEvents);

// POST /api/events 
router.post("/", createEvent);

// POST /api/:id/join
router.post("/:id/join", joinEvent);

// GET /api/events/:id 
router.get("/:id", getEventById);

// PUT /api/events/:id 
router.put("/:id", updateEvent);

// DELETE /api/events/:id
router.delete("/:id", deleteEvent);

export default router;