'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware: Proteksi route (harus login)
const protect = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    // Cek apakah token ada dan formatnya benar
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Akses ditolak. Token tidak ditemukan atau format salah.' 
      });
    }

    // Extract token (hapus kata "Bearer ")
    const token = authHeader.split(' ')[1];
    
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cari user berdasarkan id dari token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // jangan kirim password
    });
    
    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User tidak ditemukan.' 
      });
    }

    // Simpan user ke req untuk digunakan di controller
    req.user = user;
    next(); // Lanjut ke handler berikutnya
  } catch (error) {
    console.error('Auth error:', error.message);
    
    // Jika token expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token sudah kadaluarsa. Silakan login ulang.' 
      });
    }
    
    // Jika token tidak valid
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak valid.' 
    });
  }
};

// Middleware: Khusus admin (harus sudah login dulu dengan protect)
const adminOnly = (req, res, next) => {
  // Cek apakah user ada dan role-nya admin
  if (req.user && req.user.role === 'admin') {
    next(); // Lanjut, user adalah admin
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Akses ditolak. Hanya admin yang diizinkan.' 
    });
  }
};

// Optional: Middleware untuk opsional auth (boleh login boleh tidak)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next(); // Tetap lanjut meskipun auth gagal
  }
};

module.exports = { 
  protect, 
  adminOnly,
  optionalAuth 
};
