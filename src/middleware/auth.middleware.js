const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

// Verify JWT token from HTTP-only cookie
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // Read from HTTP-only cookie
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

// Redirect unauthenticated users to the login page
exports.ensureAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.clearCookie('accessToken');
    return res.redirect('/login');
  }
};

// Check if user is Admin or Owner
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.userId);
    if (!user || user.role !== 'Owner') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Load current user data into template locals for EJS
exports.loadUserToLocals = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userService.getUserById(decoded.userId);
      if (user) {
        res.locals.currentUser = user;
        res.locals.isLoggedIn = true;
        return next();
      }
    }
    res.locals.currentUser = null;
    res.locals.isLoggedIn = false;
    next();
  } catch (error) {
    res.locals.currentUser = null;
    res.locals.isLoggedIn = false;
    next();
  }
};