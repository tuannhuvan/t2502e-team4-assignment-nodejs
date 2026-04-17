const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const projectService = require('../services/project.service');

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
    return res.redirect('/login');
  }
};

// Check if user is project owner (Only Owner can delete project or edit workflow/Add List)
exports.isProjectOwner = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner?.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Only project owner can perform this action' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Check if user can update project workflow or task lists (Owner or Member with 'admin' permission)
exports.isProjectAdmin = async (req, res, next) => {
  try {
    const canModify = await projectService.userCanModifyProject(req.params.id, req.userId);
    if (!canModify) {
      return res.status(403).json({ message: 'Only project owner or admin can modify this project' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is Owner globally
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