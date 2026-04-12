'use strict';

const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure the uuid-ossp extension exists

    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
      },
      token: {
        type: DataType.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataType.UUID,
        allowNull: false,
        unique: true, // ensures one-to-one
        references: {
          model: 'users', // table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      expiryDate: {
        type: DataType.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_tokens');
  },
};
