import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({
  transports: ['websocket'],
})
export class ChatService implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}
  @WebSocketServer() server: Server;
  async handleConnection(client: Socket) {
    const user = await this.getUser(client);
    if (!user) this.handleDisconnect(client);
    else {
      console.log(`Client ${client.id} connected. Id: ${user.userId}`);
    }
  }
  async handleDisconnect(client: Socket) {
    client.disconnect(true);
    console.log(`profile left room -- ${client.id}`);
  }
  @SubscribeMessage('join')
  handleJoin(client: Socket, roomId: string) {
    console.log(`Client ${client.id} joined room: ${roomId}`);
    client.join(roomId);
    return roomId;
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, roomId: string) {
    console.log(`Client ${client.id} leaved room: ${roomId}`);
    client.leave(roomId);
    return roomId;
  }
  @SubscribeMessage('message')
  async handleMessage(client: Socket, createMessageDto: CreateMessageDto) {
    console.log(
      `Client ${client.id} sended message: ${createMessageDto.content} to room: ${createMessageDto.roomId}`,
    );
    try {
      const user = await this.getUser(client);
      if (!user) {
        throw new Error('User not found!');
      }
      const message = await this.messageService.create(
        createMessageDto,
        user.userId,
      );

      client.to(message.room.id).emit('message', message);
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(client: Socket): Promise<{ userId: string } | null> {
    const token = client.handshake.auth.token;

    if (!token) {
      return null;
    }

    try {
      const payload = this.authService.verifyToken(token);

      if (payload['exp'] < new Date().getTime() / 1000) return null;

      return payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
