'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      messageType: { type: DataType.STRING, allowNull: false },
      content: { type: DataType.STRING, allowNull: false },
      conversationId: {
        type: DataType.UUID,
        allowNull: false,
        refrences: {
          model: 'conversations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      senderId: {
        type: DataType.UUID,
        allowNull: false,
        refrences: {
          model: 'users',
          key: 'id',
        },
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
    await queryInterface.dropTable('messages');
  },
};
