import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseTestService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseTestService.name);

  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      // Authenticate attempts to connect to the database
      await this.sequelize.authenticate();
      this.logger.log(
        '✅ Connection to PostgreSQL has been established successfully.',
      );

      console.log('DB CONFIG:', {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      });
    } catch (error) {
      this.logger.error('❌ Unable to connect to the database:', error);
    }
  }
}
