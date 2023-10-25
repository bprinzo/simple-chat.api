import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entities/user/user.entity';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  transports: ['websocket'],
})
export class ChatService implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer() server: Server;
  async handleConnection(client: Socket) {
    const user = await this.getUser(client);
    if (!user) this.handleDisconnect(client);
    else {
      console.log(`Client ${client.id} connected. Id: ${user.id}`);
    }
  }
  async handleDisconnect(client: Socket) {
    client.disconnect(true);
    console.log(`profile left room -- ${client.id}`);
  }

  async getUser(client: Socket): Promise<User | null> {
    const token = client.handshake.auth.token;

    if (!token) {
      return null;
    }

    try {
      const payload = this.authService.verifyToken(token);

      if (payload['exp'] < new Date().getTime() / 1000) return null;
      const user = await this.userService.findOne(payload.userId);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
