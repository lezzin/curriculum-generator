import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDto, RemoveDto } from './dto/base.dto';
import { BaseService } from './base.service';

@Controller('/base')
export class BaseController {
  constructor(
    private readonly baseService: BaseService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async generate(@Body() createDto: CreateDto, @Req() req) {
    const { description, type } = createDto;
    const userId = req.user?.id;

    return await this.baseService.create(description, type, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/remove')
  async remove(@Body() removeDto: RemoveDto, @Req() req) {
    const { type } = removeDto;
    const userId = req.user?.id;
    return await this.baseService.remove(type, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll(@Req() req) {
    const userId = req.user?.id;
    return await this.baseService.getAll(userId);
  }
}
