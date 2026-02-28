import { NotFoundException } from "@nestjs/common";
import { ResumeRepository } from "src/domain/repositories/resume.repository";
import { UserConfigRepository } from "src/domain/repositories/user-config.repository";
import { UserRepository } from "src/domain/repositories/user.repository";
import { ResumeDocumentService } from "src/infrastructure/services/resume-document.service";

export class GetPageUseCase {
    constructor(
        private readonly resumeDocumentService: ResumeDocumentService,
        private readonly resumeRepository: ResumeRepository,
        private readonly userConfigRepository: UserConfigRepository,
        private readonly userRepository: UserRepository,
    ) { }

    async execute(id: string) {
        const resume = await this.resumeRepository.findById(id)
        if (!resume) {
            return new NotFoundException('Currículo não encontrado!')
        }

        const user = await this.userRepository.findById(resume.userId);
        if (!user) {
            return new NotFoundException('Usuário não encontrado!')
        }

        const userConfig = await this.userConfigRepository.findByUserId(resume.userId)

        return this.resumeDocumentService.generateResumeHtml(resume, user, userConfig, 'page');
    }
}