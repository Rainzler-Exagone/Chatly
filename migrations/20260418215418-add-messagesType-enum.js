'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create ENUM type safely
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_messages_messageType" AS ENUM (
          'text',
          'image',
          'video',
          'audio',
          'file'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Drop default FIRST (important fix)
    await queryInterface.sequelize.query(`
      ALTER TABLE "messages"
      ALTER COLUMN "messageType" DROP DEFAULT;
    `);

    // 3. Change column type
    await queryInterface.sequelize.query(`
      ALTER TABLE "messages"
      ALTER COLUMN "messageType"
      TYPE "enum_messages_messageType"
      USING "messageType"::text::"enum_messages_messageType";
    `);

    // 4. Re-apply default AFTER type change
    await queryInterface.sequelize.query(`
      ALTER TABLE "messages"
      ALTER COLUMN "messageType"
      SET DEFAULT 'text';
    `);

    // 5. Ensure NOT NULL
    await queryInterface.sequelize.query(`
      ALTER TABLE "messages"
      ALTER COLUMN "messageType"
      SET NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "messages"
      ALTER COLUMN "messageType"
      DROP DEFAULT;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "messages"
      ALTER COLUMN "messageType"
      TYPE VARCHAR(20);
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_messages_messageType";
    `);
  },
};