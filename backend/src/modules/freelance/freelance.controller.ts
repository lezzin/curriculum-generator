import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FreelanceService } from './services/freelance.service';
import { SolicitationDto } from './dto/freelance.dto';
import { baseFreelance } from 'src/data/base-freelance';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/freelance')
export class FreelanceController {
  constructor(private readonly freelanceService: FreelanceService) { }

  @Post('/proposal/generate')
  async generateProposal(@Body() solicitationDto: SolicitationDto) {
    const { solicitation } = solicitationDto;

    return await this.freelanceService.sendProposalToQueue(
      baseFreelance,
      solicitation,
    );
  }

  @Get('/proposal/all')
  async getAllProposals() {
    return await this.freelanceService.getAllProposals();
  }
}
