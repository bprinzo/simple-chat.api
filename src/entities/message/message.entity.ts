import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Room } from '../room/room.entity';
import { User } from '../user/user.entity';
@Entity()
export class Message extends BaseEntity<Message> {
  @Column()
  content: string;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

  @ManyToOne(() => User, (user) => user.messages)
  owner: User;
}
