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

  @IsString()
  @MaxLength(5000)
  declare content: string;

  @IsOptional()
  @IsEnum(MessageType)
  declare messageType: MessageType;
}

export class getMessageDto {
  @IsUUID()
  declare receiverId: string;

  @IsOptional()
  @IsUUID()
  before?;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 30;
}
