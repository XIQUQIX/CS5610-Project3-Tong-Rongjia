import express from "express";
import { getEvents, createEvent, getEventById, updateEvent, deleteEvent } from "../controllers/eventController.js";

const router = express.Router();

// GET /api/events - 获取所有事件（支持查询参数如 ?category=sports）
router.get("/", getEvents);

// POST /api/events - 创建新事件
router.post("/", createEvent);

// GET /api/events/:id - 获取单个事件
router.get("/:id", getEventById);

// PUT /api/events/:id - 更新事件
router.put("/:id", updateEvent);

// DELETE /api/events/:id - 删除事件
router.delete("/:id", deleteEvent);

export default router;