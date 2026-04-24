import { Body, OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';

interface SocketAuth {
  userId: string;
  token?: string;
}
type AuthenticatedSocket = Socket<any, any, any, SocketAuth>;

@WebSocketGateway({
  cors: {
    // origin: ['http://localhost:5173'],
    origin: '*',
  },
})
export class MyGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}
  private users = new Map<string, string>();

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
    });
  }

  private getUserId(socket: AuthenticatedSocket): string | null {
    const userId = socket.handshake.auth?.userId as string;

    if (typeof userId !== 'string') {
      return null;
    }

    return userId;
  }

  handleConnection(socket: AuthenticatedSocket) {
    const userId = this.getUserId(socket);

    if (!userId) {
      console.log('Connection rejected: no userId');

      socket.disconnect();

      return;
    }

    /*
    Join user room
    */

    socket.join(`user:${userId}`);

    /*
    Store mapping (optional)
    */

    this.users.set(userId, socket.id);

    console.log('User connected:', userId);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    const userId = socket.handshake.auth?.userId as string;
    // socket.handshake.headers['token'];

    if (userId) {
      this.users.delete(userId);
    }

    console.log('User disconnected:', userId);
  }

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'Hello from the server!',
      content: body,
    });
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: {
      receiverId: string;
      message: string;
      messageType: string;
      iv?: string;
      ciphertext?: string;
      objectKey?: string;
      authTag?: string;
    },
    @ConnectedSocket()
    socket: AuthenticatedSocket,
  ) {
    const senderId = socket.handshake.auth.userId as string;
    if (!senderId) {
      socket.disconnect();
      return;
    }
    try {
      const message = await this.chatService.sendMessage(
        senderId,
        data.receiverId,
        data.messageType || 'text',
        data.message,
        data.iv,
        data.objectKey,
        data.authTag,
      );
      // NOW emit AFTER DB commit
      this.server
        .to(`user:${data.receiverId}`)
        .emit('receive_message', message);

      socket.emit('message_sent', message);
    } catch (err) {
      console.error('send_message failed:', err);

      socket.emit('message_error', {
        error: 'Message failed',
      });
    }
  }
}
