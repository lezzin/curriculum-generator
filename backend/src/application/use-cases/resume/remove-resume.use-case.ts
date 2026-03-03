import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { ResumeDocumentService } from 'src/infrastructure/services/resume-document.service';

export class RemoveResumeUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly resumeDocumentService: ResumeDocumentService
  ) { }

  async execute(resumeId: string) {
    await this.resumeRepository.remove(resumeId);
    await this.resumeDocumentService.deletePdfById(resumeId)
  }
}
