'use strict';

// 1. Load env (WAJIB paling atas)
require('dotenv').config();

// 2. Import library
const express = require('express');
const cors = require('cors');

// 3. Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');

// DEBUG: cek apakah benar function/router
console.log('authRoutes:', typeof authRoutes);
console.log('projectRoutes:', typeof projectRoutes);
console.log('skillRoutes:', typeof skillRoutes);

const app = express();
const PORT = process.env.PORT || 3000;

// — MIDDLEWARE —
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// — ROUTES (PASTIKAN SEMUA FUNCTION!) —
if (typeof authRoutes === 'function') {
  app.use('/api/auth', authRoutes);
} else {
  console.error('❌ authRoutes bukan function!');
}

if (typeof projectRoutes === 'function') {
  app.use('/api/projects', projectRoutes);
} else {
  console.error('❌ projectRoutes bukan function!');
}

if (typeof skillRoutes === 'function') {
  app.use('/api/skills', skillRoutes);
} else {
  console.error('❌ skillRoutes bukan function!');
}

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend RPL berjalan!',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      skills: '/api/skills'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
