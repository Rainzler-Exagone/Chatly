import { Injectable, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketClient implements OnModuleInit {
  public socketClient: Socket;

  constructor() {
    this.socketClient = io('http://localhost:3000');
  }

  //interface for socket client to listen to events from the server
  onModuleInit() {
    this.socketClient.on('connect', () => {
      console.log('connected to gateaway ');
    });
  }
}
