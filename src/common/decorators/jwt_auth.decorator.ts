import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

export function JwtAuth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('defaultBearerAuth'),
  );
}
