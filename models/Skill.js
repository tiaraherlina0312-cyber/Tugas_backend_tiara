'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      /* relasi antar model ditulis di sini */
    }
  }

  Skill.init({
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nama skill tidak boleh kosong' }
      }
    },
    kategori: { type: DataTypes.STRING(100) },
    level: {
      type: DataTypes.ENUM('Pemula', 'Menengah', 'Mahir'),
      allowNull: false,
      defaultValue: 'Pemula'
    },
    icon: { type: DataTypes.STRING(50) },
    deskripsi: { type: DataTypes.TEXT }
  }, {
    sequelize,
    modelName: 'Skill'
  });

  return Skill;
};