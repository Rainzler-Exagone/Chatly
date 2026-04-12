'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('conversations', 'directKey', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('conversations', 'directKey');
  },
};
