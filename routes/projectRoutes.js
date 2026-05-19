'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Route PUBLIC
router.get('/', ctrl.getAllProjects);
router.get('/:id', ctrl.getProjectById);

// Route TERPROTEKSI (butuh login + admin)
router.post('/', protect, adminOnly, ctrl.createProject);
router.put('/:id', protect, adminOnly, ctrl.updateProject);
router.delete('/:id', protect, adminOnly, ctrl.deleteProject);

module.exports = router;