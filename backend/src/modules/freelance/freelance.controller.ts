import { Body, Controller, Post } from "@nestjs/common";
import { FreelanceService } from "./services/freelance.service";
import { SolicitationDto } from "./dto/freelance.dto";
import { baseFreelance } from "src/data/base-freelance";

@Controller('/freelance')
export class FreelanceController {
    constructor(
        private readonly freelanceService: FreelanceService,
    ) { }

    @Post('/proposal/generate')
    async generateProposal(@Body() solicitationDto: SolicitationDto) {
        const { solicitation } = solicitationDto

        return await this.freelanceService.generateAIProposal(
            baseFreelance,
            solicitation
        )
    }
}