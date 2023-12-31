import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomsDto } from './dto/get-rooms.dto';
import { SearchRoomsDto } from './dto/search-rooms.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto, userId: string) {
    const room = this.roomRepository.create({
      title: createRoomDto.title,

      owner: { id: userId },
    });
    const roomSaved = await this.roomRepository.save(room);
    return roomSaved;
  }

  async findAll(getRoomsDto: GetRoomsDto) {
    let qb = this.roomRepository.createQueryBuilder('rooms');

    if (getRoomsDto.skip && getRoomsDto.take) {
      qb = qb.skip(getRoomsDto.skip).take(getRoomsDto.take);
    }
    const rooms = await qb.orderBy('rooms.createdAt', 'DESC').getMany();
    return rooms;
  }

  findOne(id: string) {
    return this.roomRepository.findOneBy({ id });
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, userId: string) {
    const room = await this.roomRepository.findOneBy({
      id,
      owner: { id: userId },
    });
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    const updatedRoom = await this.roomRepository.save({
      id,
      ...updateRoomDto,
    });
    return updatedRoom;
  }

  async remove(id: string) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.roomRepository.delete(id);
  }

  async searchRooms(searchRoomsDto: SearchRoomsDto) {
    const qb = this.roomRepository.createQueryBuilder('rooms');

    if (searchRoomsDto.title) {
      qb.andWhere('rooms.title ILIKE :title', {
        title: `%${searchRoomsDto.title}%`,
      });
    }
    if (searchRoomsDto.ownerId) {
      qb.andWhere('rooms.ownerId = :ownerId', {
        ownerId: searchRoomsDto.ownerId,
      });
    }
    if (searchRoomsDto.skip && searchRoomsDto.take) {
      qb.skip(searchRoomsDto.skip).take(searchRoomsDto.take);
    }
    const [items, count] = await qb.getManyAndCount();
    return { items, count };
  }
}
