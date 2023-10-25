import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ChatService } from './chat.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [ChatService],
})
export class ChatModule {}
