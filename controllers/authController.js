'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Helper: buat token JWT
const generateToken = (userId) => jwt.sign(
  { id: userId },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

// POST /api/auth/register – Daftarkan user baru
const register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    
    if (!nama || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field wajib diisi!' 
      });
    }

    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email sudah terdaftar!' 
      });
    }

    const user = await User.create({ nama, email, password }); // password otomatis di-hash
    const token = generateToken(user.id);
    
    res.status(201).json({ 
      success: true, 
      message: 'Registrasi berhasil', 
      token, 
      user: { 
        id: user.id, 
        nama: user.nama, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        errors: error.errors.map(e => e.message) 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// POST /api/auth/login – Login dan dapatkan token
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email dan password wajib diisi!' 
      });
    }

    const user = await User.findOne({ where: { email } });

    // Gunakan compare untuk password yang sudah di-hash
    if (user && await user.comparePassword(password)) {
      const token = generateToken(user.id);
      return res.status(200).json({ 
        success: true, 
        message: 'Login berhasil!',
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role
        }
      });
    }

    return res.status(401).json({ 
      success: false, 
      message: 'Email atau password salah!' 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error.' 
    });
  }
};

// GET /api/auth/me – Lihat data user yang sedang login
const getUser = async (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  });
};

// POST /api/auth/logout – Konfirmasi logout (hapus token di sisi client)
const logout = async (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logout berhasil. Hapus token dari penyimpanan lokal.' 
  });
};

module.exports = { 
  register, 
  login, 
  getUser, 
  logout 
};
