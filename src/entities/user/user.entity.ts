import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/common/entities/base-entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
@Entity()
export class User extends BaseEntity<User> {
  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword(): void {
    if (this.password) this.password = bcrypt.hashSync(this.password, 10);
  }

  comparePassword(attempt: string): boolean {
    return bcrypt.compareSync(attempt, this.password);
  }
}
