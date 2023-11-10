import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/common/decorators/jwt_auth.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetRoomsDto } from './dto/get-rooms.dto';
import { SearchRoomsDto } from './dto/search-rooms.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';

@Controller('room')
@ApiTags('Room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @JwtAuth()
  create(@Body() createRoomDto: CreateRoomDto, @Request() req: any) {
    const userId: string = req.user.userId;
    return this.roomService.create(createRoomDto, userId);
  }

  @Get()
  @JwtAuth()
  findAll(@Query() getRoomsDto: GetRoomsDto) {
    return this.roomService.findAll(getRoomsDto);
  }
  @Get('search')
  @JwtAuth()
  searchRooms(@Query() searchRoomsDto: SearchRoomsDto) {
    return this.roomService.searchRooms(searchRoomsDto);
  }

  @Get(':id')
  @JwtAuth()
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @JwtAuth()
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Request() req: any,
  ) {
    const userId: string = req.user.userId;
    return this.roomService.update(id, updateRoomDto, userId);
  }

  @Delete(':id')
  @JwtAuth()
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
