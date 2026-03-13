import { RemoveResumeInput } from 'src/application/models/input/resume.input';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { ResumeDocumentService } from 'src/infrastructure/services/resume-document.service';

export class RemoveResumeUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly cache: CacheRepository,
  ) { }

  async execute(body: RemoveResumeInput) {
    await this.resumeRepository.remove(body.resumeId);
    await this.cache.invalidateScope('resume:all', body.userId);
  }
}
