import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports:[ChatModule],
  providers: [MyGateway],
})
export class GatewayModule {}
