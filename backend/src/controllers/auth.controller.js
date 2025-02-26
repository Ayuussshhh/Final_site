import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js"; // Assuming a separate utility for generating JWT tokens

export const signup = async (req, res) => {
    try {
        const { name, email, password, city, collegeName, enrollmentNumber } = req.body;

        // Validate input fields
        if (!name || !email || !password || !city || !collegeName || !enrollmentNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password before saving
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            city,
            collegeName,
            enrollmentNumber
        });

        await newUser.save();

        // Send token after successful signup
        const token = generateToken(newUser._id, res); // Send token as cookie
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                city: newUser.city,
                collegeName: newUser.collegeName,
                enrollmentNumber: newUser.enrollmentNumber
            },
            token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, res); // Generate JWT token and set as cookie
        res.status(200).json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 }); // Clear JWT cookie
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUser = (req, res) => {
    const { user } = req; // `user` is attached from the protectRoute middleware

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        collegeName: user.collegeName,
        enrollmentNumber: user.enrollmentNumber
    });
};

export const checkAuth = (req, res) => {
    const { user } = req;
    res.status(200).json({
        message: "User is authenticated",
        user
    });
};
