import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MinioService {
  private client: Client;
  private bucket = 'profile-images';

  constructor() {
    this.client = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'admin',
      secretKey: 'password123',
    });
  }

  async uploadProfileImage(userId: string, file: Buffer, filename: string) {
    const fileName = `avatars/${userId}/${uuid()}-${filename}`;

    await this.client.putObject(this.bucket, fileName, file);

    return `http://localhost:9000/avatars/${fileName}`;
  }

  async getProfileImageUrl(fileName: string) {
    return await this.client.presignedGetObject(this.bucket, fileName, 60 * 60);
  }
}
