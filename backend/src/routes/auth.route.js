import express from "express";
import { signup, login, logout, checkAuth, getUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // Use protectRoute for cookie validation

const router = express.Router();

// User signup route
router.post("/signup", signup);

// User login route
router.post('/login', login);

// User logout route
router.post('/logout', logout);

// Check authentication route (protected by protectRoute middleware - checks cookies)
router.get('/check', protectRoute, checkAuth);

// Get user data (protected route)
router.get('/user', protectRoute, getUser);  // Ensure you use protectRoute here to check cookies

export default router;
