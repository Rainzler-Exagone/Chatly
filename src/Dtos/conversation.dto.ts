import { IsString } from 'class-validator';

export class conversationDto {
  @IsString()
  declare title: string;
  @IsString()
  declare type: string;
  @IsString()
  declare createdBy: string;
}
