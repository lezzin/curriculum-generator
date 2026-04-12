import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './user.dto';
import { UpdateUserUseCase } from 'src/application/use-cases/user/update-user.use-case';

@UseGuards(JwtAuthGuard)
@Controller('/user')
export class UserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) { }

  @Post('/update')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser('id') userId: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute({ ...body, userId });
  }
}
