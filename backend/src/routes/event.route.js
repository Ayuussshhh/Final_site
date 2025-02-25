import express from "express";
import {
  getAllEvents,
  getFeaturedEvents,
  getRecommendedEvents,
  getEventsByCategory,
  getEventById, // Import the new function
  createEvent,
  deleteEvent,
  toggleFeaturedEvent,
} from "../controllers/event.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/events", getAllEvents); // Get all events (for customers)
router.get("/featured-events", getFeaturedEvents); // Get featured events (for customers)
router.get("/recommended-events", getRecommendedEvents); // Get recommended events (for customers)
router.get("/category/:category", getEventsByCategory); // Get events by category (for customers)
router.get('/events/:id', getEventById); // Get event by ID (for customers) - changed to use :id

// Admin Routes (protected by middleware)
router.post("/event", protectRoute, createEvent); // Admin can create events
router.delete("/event/:id", protectRoute, deleteEvent); // Admin can delete events
router.patch("/event/featured/:id", protectRoute, toggleFeaturedEvent); // Admin can toggle featured status
// Optional: Admin can update event details (add this if needed in future)
router.put("/event/:id", protectRoute);

export default router;
