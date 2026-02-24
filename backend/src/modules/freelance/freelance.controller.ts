import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FreelanceService } from './services/freelance.service';
import { SolicitationDto } from './dto/freelance.dto';
import { baseFreelance } from 'src/data/base-freelance';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/freelance')
export class FreelanceController {
  constructor(private readonly freelanceService: FreelanceService) { }

  @Post('/proposal/generate')
  async generateProposal(@Body() solicitationDto: SolicitationDto, @Req() req) {
    const { solicitation } = solicitationDto;
    const userId = req.user?.id;

    return await this.freelanceService.sendProposalToQueue(
      baseFreelance,
      solicitation,
      userId,
    );
  }

  @Get('/proposal/all')
  async getAllProposals(@Req() req) {
    const userId = req.user?.id;
    return await this.freelanceService.getAllProposals(userId);
  }
}
