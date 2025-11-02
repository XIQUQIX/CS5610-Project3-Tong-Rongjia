import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

dotenv.config();

export async function getEvents(req, res) {
  try {
    const db = await connectDB();
    const events = db.collection("events");
    
    // 简单过滤示例（可选，根据 req.query）
    let query = {};
    if (req.query.category) query.category = req.query.category;
    
    const allEvents = await events.find(query).toArray();
    res.json(allEvents);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}

export async function createEvent(req, res) {
  try {
    const db = await connectDB();
    const events = db.collection("events");
    
    const newEvent = {
      ...req.body,  // 从前端 POST body 拿 title, category 等
      createdAt: new Date().toISOString()
    };
    
    const result = await events.insertOne(newEvent);
    res.status(201).json({ _id: result.insertedId, ...newEvent });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
}

export async function getEventById(req, res) {
  try {
    const db = await connectDB();
    const events = db.collection("events");
    
    const event = await events.findOne({ _id: new ObjectId(req.params.id) });  // 需 import ObjectId from "mongodb"
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
}

export async function updateEvent(req, res) {
  try {
    const db = await connectDB();
    const events = db.collection("events");
    
    const result = await events.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }  // 更新 body 中的字段，如 { currentParticipants: 10 }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
}

export async function deleteEvent(req, res) {
  try {
    const db = await connectDB();
    const events = db.collection("events");
    
    const result = await events.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
}