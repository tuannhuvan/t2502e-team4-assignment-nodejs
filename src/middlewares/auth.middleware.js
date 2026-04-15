const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

/**
 * Middleware dùng cho API (Trả về JSON)
 * Kiểm tra Access Token trong HTTP-only Cookie
 */
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập hoặc phiên làm việc hết hạn' });
    }

    // Xác thực token bằng secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Gán userId vào request để các controller sau sử dụng
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

/**
 * Middleware dùng cho Routes Render giao diện (EJS)
 * Nếu chưa đăng nhập sẽ redirect về trang login
 */
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
    // Xóa cookie nếu token lỗi để tránh loop redirect
    res.clearCookie('accessToken');
    return res.redirect('/login');
  }
};

/**
 * Middleware kiểm tra quyền Owner (Chủ sở hữu)
 * Thường dùng cho các chức năng xóa/sửa Project
 */
exports.isOwner = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.userId);
    
    if (!user || user.role !== 'Owner') {
      return res.status(403).json({ 
        message: 'Quyền truy cập bị từ chối: Chỉ dành cho Chủ sở hữu (Owner)' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Lỗi kiểm tra quyền hạn' });
  }
};

/**
 * Middleware kiểm tra quyền Admin
 * Dùng để quản lý hệ thống hoặc xóa User
 */
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.userId);
    
    // Giả sử logic của bạn là admin có thể là Owner hoặc một role Admin riêng biệt
    if (!user || user.role !== 'Owner') { 
      return res.status(403).json({ message: 'Yêu cầu quyền quản trị viên' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Lỗi kiểm tra quyền quản trị' });
  }
};

/**
 * Middleware tùy chọn: Gắn thông tin User vào res.locals
 * Giúp hiển thị thông tin User (Tên, Avatar) trực tiếp trên mọi file EJS
 */
exports.loadUserToLocals = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userService.getUserById(decoded.userId);
      if (user) {
        res.locals.currentUser = user; // Bạn có thể dùng <%= currentUser.fullName %> trong EJS
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