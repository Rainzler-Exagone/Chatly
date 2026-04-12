'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversations', {
      id: {
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      title: { type: DataType.STRING, allowNull: false },
      type: { type: DataType.STRING, allowNull: false },
      createdBy: {
        type: DataType.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataType.DATE,
        defaultValue: DataType.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataType.DATE,
        defaultValue: DataType.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversations');
  },
};
