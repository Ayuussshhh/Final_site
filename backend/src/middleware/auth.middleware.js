import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Common function to extract token from cookies or headers
const getToken = (req) => {
    return req.cookies?.jwt || req.headers['authorization']?.split(' ')[1]; // Extract from cookies or headers
};

// Protect route middleware - Checks token in cookies and fetches user details
export const protectRoute = async (req, res, next) => {
    try {
        const token = getToken(req);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No Token Provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
            } else if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized - Token Expired' });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in protectRoute middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Authenticate JWT middleware - Checks token in Authorization header
export const authenticateJWT = (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};
