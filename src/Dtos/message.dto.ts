import {
  IsUUID,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
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

  @IsString()
  @MaxLength(5000)
  declare content: string;

  @IsOptional()
  @IsEnum(MessageType)
  declare messageType: MessageType;
}
