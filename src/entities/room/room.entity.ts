import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base-entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';

@Entity()
export class Room extends BaseEntity<Room> {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.rooms)
  owner: User;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.joinedRooms)
  @JoinTable()
  members: User[];
}
