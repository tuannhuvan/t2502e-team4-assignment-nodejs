const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const userService = require('./user.service');

// Generate Access Token (short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' }); // 15 minutes
};

// Generate Refresh Token (long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // 7 days
};

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Password hashing is now handled automatically by the User model pre-save middleware
        await userService.createUser({
            fullName: name,
            email,
            password
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Use the model's comparePassword method
        const isPasswordValid = await existingUser.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(existingUser._id);
        const refreshToken = generateRefreshToken(existingUser._id);

        // Store refresh token in database
        const refreshTokenDoc = new RefreshToken({
            user: existingUser._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
        await refreshTokenDoc.save();

        // Send access token via HTTP-only cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        // Send refresh token in response (client should store this securely)
        res.status(200).json({
            message: 'Login successful',
            redirectTo: '/dashboard',
            refreshToken,
            user: {
                id: existingUser._id,
                email: existingUser.email,
                fullName: existingUser.fullName,
                role: existingUser.role
            }
        });

    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Check if refresh token exists in database
        const storedToken = await RefreshToken.findOne({
            user: decoded.userId,
            token: token
        });

        if (!storedToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(decoded.userId);

        // Send new access token via HTTP-only cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

const logout = async (req, res) => {
    try {
        // Clear the access token cookie
        res.clearCookie('accessToken');

        // Optionally, you could invalidate the refresh token in the database
        // For now, we'll just clear the cookie

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, refreshToken, logout };