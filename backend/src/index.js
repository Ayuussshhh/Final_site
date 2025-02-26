import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import session from "express-session";

import authRoutes from './routes/auth.route.js';
import eventRoutes from "./routes/event.route.js";
// import paymentRoutes from "./routes/payment.route.js"; // Payment routes can be added if needed

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware setup
app.use(cookieParser());
app.use(express.json());

// CORS setup to allow credentials and specific origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Accept requests from specific origin
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/events", eventRoutes);
// app.use("/api", paymentRoutes); // Uncomment if payment routes are needed

// Serve frontend in production environment
if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Error handling middleware with more descriptive messages
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start server with async/await to ensure DB connection
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit if database connection fails
  }
};

startServer();
