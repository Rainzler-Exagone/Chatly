'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversation_participants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      conversationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.ENUM('owner', 'admin', 'member', 'guest'),
        allowNull: false,
        defaultValue: 'member',
      },
      joinedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Optional: unique constraint to prevent duplicate participants
    await queryInterface.addConstraint('conversation_participants', {
      fields: ['conversationId', 'userId'],
      type: 'unique',
      name: 'unique_conversation_user',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversation_participants');
  },
};
