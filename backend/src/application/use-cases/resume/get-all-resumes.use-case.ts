import {
  GetAllResumesOutput,
  ResumeItemOutput,
} from 'src/application/models/output/get-all-resumes.output';
import { Resume } from 'src/domain/entities/resume.entity';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';

export class GetAllResumesUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly cache: CacheRepository,
  ) { }

  async execute(userId: string): Promise<GetAllResumesOutput> {
    return this.cache.rememberByScope(
      'resume:all',
      userId,
      5,
      async () => {
        const resumes = await this.resumeRepository.getAll(userId);
        const items = resumes.map(this.toOutput);

        return {
          items,
          total: items.length,
        };
      });
  }

  private toOutput(resume: Resume): ResumeItemOutput {
    return {
      id: resume.id,
      userId: resume.userId,
      prompt: resume.prompt,
      template: resume.template,
      createdAt: resume.createdAt,
    };
  }
}
