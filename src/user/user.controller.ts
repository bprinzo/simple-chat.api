import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/common/decorators/jwt_auth.decorator';
import { SearchUsersDto } from './dto/search-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @JwtAuth()
  findAll() {
    return this.userService.findAll();
  }
  @Get('search')
  @JwtAuth()
  searchUsers(@Query() searchUsersDto: SearchUsersDto) {
    return this.userService.searchUsers(searchUsersDto);
  }

  @Get(':id')
  @JwtAuth()
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch()
  @JwtAuth()
  update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    const id: string = req.user.userId;
    return this.userService.update(id, updateUserDto);
  }
  @Patch('/password')
  @JwtAuth()
  updatePassword(
    @Request() req: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const id: string = req.user.userId;
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete()
  @JwtAuth()
  remove(@Request() req: any) {
    const id: string = req.user.userId;
    return this.userService.remove(id);
  }
}
