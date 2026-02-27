import { PdfService } from "src/infrastructure/services/pdf.service";

export class GeneratePdfUseCase {
    constructor(
        private readonly pdfService: PdfService
    ) { }

    async execute(id: string) {
        return this.pdfService.getPdfById(id)
    }
}