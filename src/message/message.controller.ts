import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/common/decorators/jwt_auth.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get-message.dto';
import { MessageService } from './message.service';

@Controller('message')
@ApiTags('Message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @JwtAuth()
  create(@Body() createMessageDto: CreateMessageDto, @Request() req: any) {
    const userId: string = req.user.userId;
    return this.messageService.create(createMessageDto, userId);
  }

  @Get()
  @JwtAuth()
  findAllByRoomId(@Query() getMessagesDto: GetMessagesDto) {
    return this.messageService.findAllByRoom(getMessagesDto);
  }
}
