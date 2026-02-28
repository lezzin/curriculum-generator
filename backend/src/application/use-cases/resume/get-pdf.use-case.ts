import { ResumeDocumentService } from "src/infrastructure/services/resume-document.service";

export class GetPdfUseCase {
    constructor(
        private readonly resumeDocumentService: ResumeDocumentService
    ) { }

    async execute(id: string) {
        return this.resumeDocumentService.getPdfById(id)
    }
}