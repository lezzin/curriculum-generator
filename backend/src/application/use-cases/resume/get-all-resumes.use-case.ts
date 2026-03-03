import { GetAllResumesOutput, ResumeItemOutput } from 'src/application/models/output/get-all-resumes.output';
import { Resume } from 'src/domain/entities/resume.entity';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { REMEMBER_RESUMES_CACHE_PREFIX } from 'src/domain/shared/constants/cache.constants';
import { makeCacheKey } from 'src/domain/shared/helpers/cache-key.helper';

export class GetAllResumesUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly cache: CacheRepository,
  ) { }

  async execute(userId: string): Promise<GetAllResumesOutput> {
    const cacheKey = makeCacheKey(REMEMBER_RESUMES_CACHE_PREFIX, userId);
    return this.cache.remember(cacheKey, 600, async () => {
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
      prompt: resume.prompt,
      template: resume.template,
      createdAt: resume.createdAt
    };
  }
}
