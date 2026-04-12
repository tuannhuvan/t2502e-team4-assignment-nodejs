const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

// Verify JWT token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is Owner
exports.isOwner = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'Owner') {
      return res.status(403).json({ message: 'Only owners can modify projects' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};