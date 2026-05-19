'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/skillController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', ctrl.getAllSkills);
router.get('/:id', ctrl.getSkillById);
router.post('/', protect, adminOnly, ctrl.createSkill);
router.put('/:id', protect, adminOnly, ctrl.updateSkill);
router.delete('/:id', protect, adminOnly, ctrl.deleteSkill);

module.exports = router;