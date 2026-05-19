'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    // Hash password manual karena bulkInsert tidak melewati hook model
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await queryInterface.bulkInsert('Users', [
      {
        nama: 'Admin Portofolio',
        email: 'admin@portofolio.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};