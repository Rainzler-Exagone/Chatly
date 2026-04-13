'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'conversations',
      'lastMessageAt',
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );

    await queryInterface.addIndex(
      'conversations',
      ['lastMessageAt'],
      {
        name: 'idx_conversations_last_message_at',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'conversations',
      'idx_conversations_last_message_at'
    );

    await queryInterface.removeColumn(
      'conversations',
      'lastMessageAt'
    );
  },
};