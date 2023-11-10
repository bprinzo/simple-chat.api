import { PartialType } from '@nestjs/swagger';
import { SigninDto } from 'src/auth/dto/signin.dto';

export class UpdateUserDto extends PartialType(SigninDto) {}
