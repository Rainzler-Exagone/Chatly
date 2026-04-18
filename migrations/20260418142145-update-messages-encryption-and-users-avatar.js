'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.removeColumn('messages', 'content', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('messages', 'ciphertext', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('messages', 'iv', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('messages', 'authTag', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('messages', 'objectKey', {
      type: Sequelize.STRING,
      allowNull: true,
    });

  },

  async down(queryInterface, Sequelize) {
    /*
     Rollback in reverse order
    */

    await queryInterface.removeColumn('messages', 'objectKey');

    await queryInterface.removeColumn('messages', 'authTag');

    await queryInterface.removeColumn('messages', 'iv');

    await queryInterface.removeColumn('messages', 'ciphertext');
  },
};
