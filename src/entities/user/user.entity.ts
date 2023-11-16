import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/common/entities/base-entity';
import { BeforeInsert, Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Message } from '../message/message.entity';
import { Room } from '../room/room.entity';
@Entity()
export class User extends BaseEntity<User> {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ select: false })
  password: string;

  @ApiProperty()
  @OneToMany(() => Room, (room) => room.owner)
  rooms: Room[];

  @ApiProperty()
  @ManyToMany(() => Room, (room) => room.members, { onDelete: 'CASCADE' })
  joinedRooms: Room[];

  @ApiProperty()
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
