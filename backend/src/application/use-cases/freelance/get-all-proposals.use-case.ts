import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX } from 'src/domain/shared/constants/cache.constants';
import { makeCacheKey } from 'src/domain/shared/helpers/cache-key.helper';

export class GetAllProposalsUseCase {
  constructor(
    private readonly freelanceProposalRepository: FreelanceProposalRepository,
    private readonly cache: CacheRepository,
  ) {}

  async getAll(userId: string) {
    const cacheKey = makeCacheKey(
      REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX,
      userId,
    );
    const callback = async () =>
      await this.freelanceProposalRepository.getAll(userId);
    return this.cache.remember(cacheKey, 600, callback);
  }
}
