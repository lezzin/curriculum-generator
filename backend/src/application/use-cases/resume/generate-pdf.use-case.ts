import { Resume } from "src/domain/entities/resume.entity";
import { PdfService } from "src/infrastructure/services/pdf.service";

export class GeneratePdfUseCase {
    constructor(
        private readonly pdfService: PdfService
    ) { }

    async execute(body: Resume) {
        return this.pdfService.generateResumePdf(body)
    }
}