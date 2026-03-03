import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { GenerateProposalUseCase } from 'src/application/use-cases/freelance/generate-proposal.use-case';
import { GetAllProposalsUseCase } from 'src/application/use-cases/freelance/get-all-proposals.use-case';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { GenerateProposalDto } from './freelance.dto';

@UseGuards(JwtAuthGuard)
@Controller('/freelance')
export class FreelanceController {
  constructor(
    private readonly generateProposalUseCase: GenerateProposalUseCase,
    private readonly getAllProposalsUseCase: GetAllProposalsUseCase,
  ) { }

  @Post('/proposal/generate')
  @HttpCode(HttpStatus.ACCEPTED)
  async generateProposal(
    @Body() body: GenerateProposalDto,
    @CurrentUser('id') userId: string,
  ) {
    await this.generateProposalUseCase.execute({ ...body, userId });
  }

  @Get('/proposal/all')
  async getAllProposals(@CurrentUser('id') userId: any) {
    return await this.getAllProposalsUseCase.getAll(userId);
  }
}
