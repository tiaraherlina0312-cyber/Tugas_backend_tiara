'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', ctrl.register);    // publik
router.post('/login', ctrl.login);          // publik
router.post('/logout', ctrl.logout);        // publik
//router.get('/me', protect, ctrl.getUser);   // butuh token (ganti getMe jadi getUser)

module.exports = router;
