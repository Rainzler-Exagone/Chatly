'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'lastActiveAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addIndex('users', ['lastActiveAt'], {
      name: 'idx_users_last_active_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatar');
    await queryInterface.removeIndex('users', 'idx_users_last_active_at');

    await queryInterface.removeColumn('users', 'lastActiveAt');
  },
};
