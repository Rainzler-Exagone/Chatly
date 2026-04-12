'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('message_reads', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },

      messageId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'messages', // table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Optional but recommended indexes
    await queryInterface.addIndex('message_reads', ['messageId']);
    await queryInterface.addIndex('message_reads', ['userId']);

   
    await queryInterface.addConstraint('message_reads', {
      fields: ['messageId', 'userId'],
      type: 'unique',
      name: 'unique_message_user_read',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('message_reads');
  },
};