import { Resume } from "src/domain/entities/resume.entity";
import { UserConfig } from "src/domain/entities/user.config.entity";
import { User } from "src/domain/entities/user.entity";
import { ResumeDocumentService } from "src/infrastructure/services/resume-document.service";

export class GeneratePdfUseCase {
    constructor(
        private readonly resumeDocumentService: ResumeDocumentService
    ) { }

    async execute(body: { resume: Resume, user: User, userConfig: UserConfig | null }) {
        return this.resumeDocumentService.generateResumePdf(body.resume, body.user, body.userConfig)
    }
}