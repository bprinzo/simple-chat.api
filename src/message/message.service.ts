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
    let qb = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.owner', 'owner')
      .where('message.roomId = :roomId', { roomId: getMessagesDto.roomId });

    if (getMessagesDto.skip && getMessagesDto.take) {
      qb = qb.skip(getMessagesDto.skip).take(getMessagesDto.take);
    }
    const [items, count] = await qb.getManyAndCount();
    return { items, count };
  }
}
