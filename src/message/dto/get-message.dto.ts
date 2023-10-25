import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
export class GetMessagesDto extends PaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
