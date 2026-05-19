'use strict';
const { Skill } = require('../models');

const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.findAll({ 
            order: [['kategori', 'ASC'], ['nama', 'ASC']]
        });
        res.json({ success: true, count: skills.length, data: skills });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

const getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findByPk(req.params.id);
        if (!skill) {
            return res.status(404).json({ 
                success: false, 
                message: 'Skill tidak ditemukan' 
            });
        }
        res.json({ success: true, data: skill });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

const createSkill = async (req, res) => {
    try {
        const { nama, kategori, level, icon, deskripsi } = req.body;
        
        if (!nama) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nama wajib diisi' 
            });
        }
        
        const skill = await Skill.create({ 
            nama, 
            kategori, 
            level: level || 'Pemula', 
            icon, 
            deskripsi 
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Skill berhasil ditambahkan', 
            data: skill 
        });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByPk(req.params.id);
        
        if (!skill) {
            return res.status(404).json({ 
                success: false, 
                message: 'Skill tidak ditemukan' 
            });
        }
        
        await skill.update(req.body);
        
        res.json({ 
            success: true, 
            message: 'Skill berhasil diperbarui', 
            data: skill 
        });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByPk(req.params.id);
        
        if (!skill) {
            return res.status(404).json({ 
                success: false, 
                message: 'Skill tidak ditemukan' 
            });
        }
        
        await skill.destroy();
        res.json({ success: true, message: 'Skill berhasil dihapus' });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

module.exports = { 
    getAllSkills, 
    getSkillById,
    createSkill, 
    updateSkill, 
    deleteSkill 
};