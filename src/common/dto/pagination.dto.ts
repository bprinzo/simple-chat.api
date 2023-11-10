import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => Number.parseInt(value))
  skip: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => Number.parseInt(value))
  take: number;
}
