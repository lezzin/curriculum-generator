import { NotFoundException } from '@nestjs/common';
import { ResumeDocumentService } from 'src/infrastructure/services/resume-document.service';

export class GetPdfUseCase {
  constructor(private readonly resumeDocumentService: ResumeDocumentService) { }

  async execute(id: string) {
    const stream = await this.resumeDocumentService.getPdfById(id);

    if (!stream) {
      throw new NotFoundException('PDF não encontrado!')
    }

    return stream;
  }
}
