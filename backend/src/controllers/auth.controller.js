import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// User signup handler
export const signup = async (req, res) => {
    try {
        const { name, email, password, city, collegeName, enrollmentNumber } = req.body;

        // Check if essential fields are present
        if (!name || !email || !password || !city || !collegeName || !enrollmentNumber) {
            return res.status(400).json({
                message: "All fields (Name, Email, Password, City, College Name, and Enrollment Number) are required"
            });
        }

        // Check if email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password before storing it
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user in the database
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            city,
            collegeName,
            enrollmentNumber,
        });

        // Save the new user to the database
        await newUser.save();

        // Generate a JWT token using the new user's ID
        generateToken(newUser._id, res);

        // Respond with success message and user data (excluding password)
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                fullName: newUser.name,
                email: newUser.email,
                city: newUser.city,
                collegeName: newUser.collegeName,
                enrollmentNumber: newUser.enrollmentNumber,
            },
        });
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// User login handler
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token and send it in response
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// User logout handler
export const logout = (req, res) => {
    try {
        // Clear JWT cookie on logout
        res.cookie('jwt', '', { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Check authentication handler
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);  // Return the authenticated user info
    } catch (error) {
        console.log('Error in checkAuth controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
