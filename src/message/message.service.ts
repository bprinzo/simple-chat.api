import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  async create(createMessageDto: CreateMessageDto, userId: string) {
    const message = this.messageRepository.create({
      content: createMessageDto.content,
      room: { id: createMessageDto.roomId },
      owner: { id: userId },
    });
    await this.messageRepository.save(message);
    return message;
  }

  async findAllByRoom(getMessagesDto: GetMessagesDto) {
    const qb = this.messageRepository
      .createQueryBuilder('message')
      .where('message.roomId = :roomId', { roomId: getMessagesDto.roomId });

    const [items, count] = await qb
      .skip(getMessagesDto.skip)
      .take(getMessagesDto.take)
      .getManyAndCount();
    return { items, count };
  }
}
