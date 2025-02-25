import express from "express";
import { signup,login, logout, checkAuth } from "../controllers/auth.controller.js"; // Adjusted the path
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// User signup route
router.post("/signup", signup);

// User login route
router.post('/login', login);

// User logout route
router.post('/logout', logout);

// Check authentication route (protected by protectRoute middleware)
router.get('/check', protectRoute, checkAuth);

// Profile routes
router.get("/profile", protectRoute,); // Get user profile
router.put("/profile", protectRoute); // Update user profile

export default router;
