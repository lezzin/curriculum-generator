import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { ResumeOptionsDto } from '../dto/prompt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeEntity } from '../entities/resume.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CacheService } from 'src/modules/cache/cache.service';
import { BaseService } from 'src/modules/profile/base.service';
import { BaseType } from 'src/modules/profile/enum/base-type.enum';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  private readonly CACHE_KEY_PREFIX = 'resume:all';

  constructor(
    @InjectQueue('resume.queue')
    private readonly resumeQueue: Queue,
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    private readonly cacheService: CacheService,
    private readonly baseService: BaseService,
  ) { }

  async sendResumeToQueue(userId: string, jobDescription: string, options: ResumeOptionsDto) {
    const baseData = (await this.baseService.getType(BaseType.RESUME, userId)).data

    if (!baseData) {
      this.logger.debug(
        `Usuário ${userId} tentou gerar currículo sem configurar dados base.`
      )

      throw new UnprocessableEntityException(
        'Cadastre primeiro suas informações base na página de Perfil para gerar um currículo personalizado.'
      )
    }

    await this.resumeQueue.add('resume', { userId, jobDescription, options }, {
      backoff: 5000,
      attempts: 3
    })

    return { message: 'Solicitação enviada com sucesso!' };
  }

  async getResumes(userId: string): Promise<ResumeEntity[] | undefined> {
    return await this.cacheService
      .getOrSet<ResumeEntity[]>(
        `${this.CACHE_KEY_PREFIX}:${userId}`,
        async () => {
          const resumes = await this.resumeRepository.find({
            order: { createdAt: 'DESC' },
            where: { userId },
            select: ['id', 'prompt', 'createdAt']
          });

          return resumes;
        },
        1800,
      )
      .catch((err) => {
        this.logger.error('Failed to fetch resumes', err);
        return [];
      });
  }
}
