'use strict';
const { Project } = require('../models');

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({ 
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, count: projects.length, data: projects });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ 
                success: false, 
                message: 'Proyek tidak ditemukan' 
            });
        }
        res.json({ success: true, data: project });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { judul, deskripsi, teknologi, url_demo, gambar } = req.body;
        
        if (!judul) {
            return res.status(400).json({ 
                success: false, 
                message: 'Judul wajib diisi' 
            });
        }
        
        const project = await Project.create({ 
            judul, 
            deskripsi, 
            teknologi, 
            url_demo, 
            gambar 
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Proyek berhasil ditambahkan', 
            data: project 
        });
    } catch (e) {
        if (e.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                success: false, 
                errors: e.errors.map(x => x.message) 
            });
        }
        res.status(500).json({ success: false, message: e.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        
        if (!project) {
            return res.status(404).json({ 
                success: false, 
                message: 'Proyek tidak ditemukan' 
            });
        }
        
        await project.update(req.body);
        
        res.json({ 
            success: true, 
            message: 'Proyek berhasil diperbarui', 
            data: project 
        });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ 
                success: false, 
                message: 'Proyek tidak ditemukan' 
            });
        }
        await project.destroy();
        res.json({ success: true, message: 'Proyek berhasil dihapus' });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message });
    }
};

module.exports = { 
    getAllProjects, 
    getProjectById, 
    createProject, 
    updateProject, 
    deleteProject 
};