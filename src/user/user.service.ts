import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { SearchUsersDto } from './dto/search-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: SignupDto) {
    const foundUser = await this.getUserByEmail(createUserDto.email);
    if (foundUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    await this.userRepository.save(user);
    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = await this.userRepository.save({
      id,
      ...updateUserDto,
    });
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.delete(id);
  }

  getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async searchUsers(searchUsersDto: SearchUsersDto) {
    const qb = this.userRepository.createQueryBuilder('user');

    if (searchUsersDto.name) {
      qb.andWhere('user.name ILIKE :name', {
        name: `%${searchUsersDto.name}%`,
      });
    }

    const [items, count] = await qb
      .skip(searchUsersDto.skip)
      .take(searchUsersDto.take)
      .getManyAndCount();
    return { items, count };
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const isPasswordValid = user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.password = newPassword;
    user.hashPassword();
    await this.userRepository.save(user);
  }
}
