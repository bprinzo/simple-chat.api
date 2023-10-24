import { PartialType } from '@nestjs/swagger';
import { SignupDto } from 'src/auth/dto/signup.dto';

export class UpdateUserDto extends PartialType(SignupDto) {}
