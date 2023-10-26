import { Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { AuthModule } from '../auth/auth.module';
import { ChatService } from './chat.service';

@Module({
  imports: [AuthModule, MessageModule],
  providers: [ChatService],
})
export class ChatModule {}
