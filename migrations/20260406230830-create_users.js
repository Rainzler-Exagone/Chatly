'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: { type: DataType.STRING, allowNull: false, unique: false },
      password: { type: DataType.STRING, allowNull: false },
      createdAt: {
        allowNull: false,
        type: DataType.DATE,
        defaultValue: DataType.NOW,
      },
      email: { type: DataType.STRING, allowNull: false, unique: true },
      updatedAt: {
        allowNull: false,
        type: DataType.DATE,
        defaultValue: DataType.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
