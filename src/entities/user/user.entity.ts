import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/common/entities/base-entity';
import { BeforeInsert, Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Message } from '../message/message.entity';
import { Room } from '../room/room.entity';
@Entity()
export class User extends BaseEntity<User> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Room, (room) => room.owner)
  rooms: Room[];

  @ManyToMany(() => Room, (room) => room.members)
  joinedRooms: Room[];

  @OneToMany(() => Message, (message) => message.owner)
  messages: Message[];

  @BeforeInsert()
  hashPassword(): void {
    if (this.password) this.password = bcrypt.hashSync(this.password, 10);
  }

  comparePassword(attempt: string): boolean {
    return bcrypt.compareSync(attempt, this.password);
  }
}
