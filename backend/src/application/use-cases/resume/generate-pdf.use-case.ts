import { Resume } from "src/domain/entities/resume.entity";
import { UserConfig } from "src/domain/entities/user.config.entity";
import { User } from "src/domain/entities/user.entity";
import { PdfService } from "src/infrastructure/services/pdf.service";

export class GeneratePdfUseCase {
    constructor(
        private readonly pdfService: PdfService
    ) { }

    async execute(body: { resume: Resume, user: User, userConfig: UserConfig | null }) {
        return this.pdfService.generateResumePdf(body.resume, body.user, body.userConfig)
    }
}