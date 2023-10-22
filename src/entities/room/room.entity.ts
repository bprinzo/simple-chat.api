import { BaseEntity } from 'src/common/entities/base-entity';
import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';

@Entity()
export class Room extends BaseEntity<Room> {
  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  @ManyToOne(() => User, (user) => user.rooms)
  owner: User;

  @ManyToMany(() => User, (user) => user.joinedRooms)
  @JoinTable()
  members: User[];
}
