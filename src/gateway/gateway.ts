import { Body, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
    });
  }

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'Hello from the server!',
      content: body,
    });
  }
}
