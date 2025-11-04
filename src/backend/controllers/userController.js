// GET /api/users/me?userId=123
import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function getMe(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in query" });
    }

    const db = await connectDB();
    const users = db.collection("users");

    let user;
    try {
      user = await users.findOne({ _id: new ObjectId(userId) });
    } catch (err) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error("getMe ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}


// GET /api/users/:id/events/joined
export const getJoinedEvents = async (req, res) => {
  try {
    const userId = req.params.id;
    const db = await connectDB();
    const events = db.collection("events");

    const joined = await events
      .find({
        participants: userId,      // user joined
        creator: { $ne: userId }   // user is NOT the creator
      })
      .toArray();

    res.json(joined);
  } catch (err) {
    console.error("getJoinedEvents ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// GET /api/users/:id/events/created
export const getCreatedEvents = async (req, res) => {
  try {
    const userId = req.params.id;
    const db = await connectDB();
    const events = db.collection("events");

    const created = await events
      .find({ creator: userId })
      .toArray();

    res.json(created);
  } catch (err) {
    console.error("getCreatedEvents ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

