import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Room } from '../room/room.entity';
import { User } from '../user/user.entity';
@Entity()
export class Message extends BaseEntity<Message> {
  @ApiProperty()
  @Column()
  content: string;
  @ApiProperty()
  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  room: Room;
  @ApiProperty()
  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  owner: User;
}
