import { Injectable, Logger } from '@nestjs/common';
import { buildResumePrompt } from '../helpers/resume.helper';
import { ResumeOptionsDto } from '../dto/prompt.dto';
import { GeminiService } from 'src/modules/gemini/services/gemini.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeEntity } from '../entities/resume.entity';
import { Repository } from 'typeorm';
import { Resume } from '../interfaces/resume.interfaces';
import { SseService } from 'src/modules/sse/sse.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { ResumePublisher } from '../messaging/rabbimq-publisher';
import { PdfService } from './pdf.service';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  private readonly CACHE_KEY_PREFIX = 'resume:all';

  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,

    private readonly resumePublisher: ResumePublisher,
    private readonly geminiService: GeminiService,
    private readonly sseService: SseService,
    private readonly cacheService: CacheService,
    private readonly pdfService: PdfService,
  ) { }

  async sendResumeToQueue(
    baseResume: any,
    userId: string,
    jobDescription: string,
    options: ResumeOptionsDto,
  ) {
    await this.resumePublisher
      .publish({ baseResume, userId, jobDescription, options })
      .catch((err) => {
        this.logger.error('Failed to publish message to RabbitMQ', err);
      });

    return { message: 'Solicitação enviada com sucesso!' };
  }

  async generateAIResume(
    baseResume: any,
    userId: string,
    jobDescription: string,
    options: ResumeOptionsDto,
  ) {
    try {
      const prompt = buildResumePrompt(baseResume, jobDescription, options);
      const resume = await this.geminiService.generateJsonResponse<Resume>(prompt);

      this.logger.debug(JSON.stringify(resume));

      const savedResume = await this.resumeRepository.save({
        ...resume,
        prompt: jobDescription,
        userId: userId,
      });

      await this.cacheService.del(`${this.CACHE_KEY_PREFIX}:${userId}`);
      await this.pdfService.generateResumePdfById(savedResume.id);

      this.sseService.sendEvent({
        event: 'resume-generated',
        data: savedResume,
      });

      return savedResume;
    } catch (err) {
      this.logger.error('Failed to generate AI resume flow', err);
      throw err;
    }
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
