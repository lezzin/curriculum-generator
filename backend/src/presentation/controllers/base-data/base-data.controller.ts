import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetAllBaseDataUseCase } from 'src/application/use-cases/base-data/get-all-base-data.use-case';
import { RemoveBaseDataUseCase } from 'src/application/use-cases/base-data/remove-base-data.use-case';
import { UpsertBaseDataUseCase } from 'src/application/use-cases/base-data/upsert-base-data.use-case';
import { BaseDataType } from 'src/domain/shared/enums/base-data-type.enum';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { UpsertBaseDataDto } from './base-data.dto';

@UseGuards(JwtAuthGuard)
@Controller('base-data')
export class BaseDataController {
  constructor(
    private readonly upsertBaseDataUseCase: UpsertBaseDataUseCase,
    private readonly removeBaseDataUseCase: RemoveBaseDataUseCase,
    private readonly getAllBaseDataUseCase: GetAllBaseDataUseCase,
  ) {}

  @Post('upsert')
  @HttpCode(HttpStatus.NO_CONTENT)
  async generate(
    @Body() body: UpsertBaseDataDto,
    @CurrentUser('id') userId: string,
  ) {
    await this.upsertBaseDataUseCase.execute({ ...body, userId });
  }

  @Post('/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Body() body: { type: BaseDataType },
    @CurrentUser('id') userId: string,
  ) {
    await this.removeBaseDataUseCase.execute(userId, body.type);
  }

  @Get('/all')
  async getAll(@CurrentUser('id') userId: string) {
    return await this.getAllBaseDataUseCase.execute(userId);
  }
}
