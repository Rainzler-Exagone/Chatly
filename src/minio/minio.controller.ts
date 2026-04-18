// avatars.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' matches the key in Postman/React
  async uploadAvatar(
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB Limit
          new FileTypeValidator({ fileType: 'image/(jpeg|png)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // We pass the file buffer and original name to our service
    const userId = req.userId; // In a real app, get this from @Req() user
    const url = await this.minioService.uploadProfileImage(
      userId,
      file.buffer,
      file.originalname,
    );

    return {
      message: 'Avatar uploaded successfully',
      url: url,
    };
  }
}
