import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class conversationDto {
  @IsString()
  declare title: string;
  @IsString()
  declare type: string;
  @IsString()
  declare createdBy: string;
}

export class GetConversationsDto {
  @IsOptional()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}


