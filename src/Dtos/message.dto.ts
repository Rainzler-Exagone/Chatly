import { Optional } from '@nestjs/common';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
}

export class createMessageDto {
  @IsUUID()
  declare receiverId: string;

  @MaxLength(5000)
  declare cipheredText: string;

  @MaxLength(5000)
  declare iv: string;

  @Optional()
  declare authTage?: string;

  @Optional()
  declare objectKey?: string;

  @IsOptional()
  @IsEnum(MessageType)
  declare messageType: MessageType;
}

export class getMessageDto {
  @IsUUID()
  declare conversationId: string;

  @IsOptional()
  @IsUUID()
  before?;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 30;
}
