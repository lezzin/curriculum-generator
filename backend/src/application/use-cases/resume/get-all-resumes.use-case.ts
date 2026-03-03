import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { REMEMBER_RESUMES_CACHE_PREFIX } from 'src/domain/shared/constants/cache.constants';
import { makeCacheKey } from 'src/domain/shared/helpers/cache-key.helper';

export class GetAllResumesUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly cache: CacheRepository,
  ) { }

  async execute(userId: string) {
    const cacheKey = makeCacheKey(REMEMBER_RESUMES_CACHE_PREFIX, userId);
    const callback = async () => await this.resumeRepository.getAll(userId);
    return this.cache.remember(cacheKey, 600, callback);
  }
}
