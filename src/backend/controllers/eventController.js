import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

dotenv.config();

/**
 * ✅ GET all events (optional filters like ?category=sports)
 */
export async function getEvents(req, res) {
  try {
    const db = await connectDB();
    const events = db.collection("events");

    let query = {};
    if (req.query.category) query.category = req.query.category;

    const allEvents = await events.find(query).toArray();
    res.json(allEvents);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}

/**
 * ✅ CREATE event
 * Required in req.body:
 * - title, category, location, date, time, maxParticipants
 * - creatorId (IMPORTANT)
 */
export async function createEvent(req, res) {
  try {
    const {
      title,
      description,
      category,
      location,
      date,
      time,
      maxParticipants,
      creatorId,
    } = req.body;

    if (!creatorId) {
      return res.status(400).json({ error: "creatorId is required" });
    }

    const db = await connectDB();
    const events = db.collection("events");

    const newEvent = {
      title,
      description,
      category,
      location,
      date,
      time,
      maxParticipants: Number(maxParticipants) || 10,
      currentParticipants: 1,
      creator: creatorId,
      participants: [creatorId], // auto join creator
      createdAt: new Date().toISOString(),
    };

    const result = await events.insertOne(newEvent);

    res.status(201).json({ ...newEvent, _id: result.insertedId });
  } catch (err) {
    console.error("createEvent ERROR:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
}

/**
 * ✅ GET single event by ID
 */
export async function getEventById(req, res) {
  try {
    const db = await connectDB();
    const events = db.collection("events");

    const event = await events.findOne({ _id: new ObjectId(req.params.id) });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
}

/**
 * ✅ // POST /api/events/:id/join
 */
export const joinEvent = async (req, res) => {
  try {
    const db = await connectDB();
    const events = db.collection("events");

    const eventId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const event = await events.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Prevent joining your own event
    if (event.creatorId === userId) {
      return res.status(400).json({ error: "You cannot join your own event" });
    }

    // Prevent joining twice
    if (event.participants && event.participants.includes(userId)) {
      return res.status(400).json({ error: "Already joined" });
    }

    // Prevent joining full events
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ error: "Event is full" });
    }

    await events.updateOne(
      { _id: new ObjectId(eventId) },
      {
        $push: { participants: userId },
        $inc: { currentParticipants: 1 }
      }
    );

    res.status(200).json({ message: "Joined successfully" });

  } catch (err) {
    console.error("Join Event Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



/**
 * ✅ UPDATE event
 * Frontend sends fields that need updating
 */
export async function updateEvent(req, res) {
  try {
    const db = await connectDB();
    const events = db.collection("events");

    const result = await events.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
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

/**
 * ✅ Leave event
 */

export const leaveEvent = async (req, res) => {
  try {
    const db = await connectDB();
    const events = db.collection("events");

    const eventId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid Event ID" });
    }

    const event = await events.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Cannot leave if not joined
    if (!event.participants || !event.participants.includes(userId)) {
      return res.status(400).json({ error: "You are not in this event" });
    }

    await events.updateOne(
      { _id: new ObjectId(eventId) },
      {
        $pull: { participants: userId },
        $inc: { currentParticipants: -1 }
      }
    );

    res.json({ message: "Left event successfully" });

  } catch (err) {
    console.error("Leave Event Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ✅ DELETE event
 */
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
