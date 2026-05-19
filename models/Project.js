'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      /* relasi antar model ditulis di sini */
    }
  }

  Project.init({
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Judul tidak boleh kosong' }
      }
    },
    deskripsi: { type: DataTypes.TEXT },
    teknologi: { type: DataTypes.STRING(255) },
    url_github: { type: DataTypes.STRING(500) },
    url_demo: { type: DataTypes.STRING(500) },
    gambar: { type: DataTypes.STRING(500) }
  }, {
    sequelize,
    modelName: 'Project'
  });

  return Project;
};