import { randomUUID } from 'crypto';
import { GenerateResumeInput } from 'src/application/models/input/generate-resume.input';
import { ResumeItemOutput } from 'src/application/models/output/get-all-resumes.output';
import { Resume } from 'src/domain/entities/resume.entity';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { BaseDataType } from 'src/domain/enums/base-data-type.enum';
import { SelectedTemplate } from 'src/domain/enums/resume.enums';
import { GeminiService } from 'src/infrastructure/services/gemini/gemini.service';
import { buildResumePrompt } from 'src/infrastructure/services/gemini/helpers/resume-prompt.helper';
import { ResumeDocumentService } from 'src/infrastructure/services/resume-document.service';
import { SseRepository } from 'src/domain/repositories/sse.repository';

export class ResumeGenerationUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly baseDataRepository: BaseDataRepository,
    private readonly userConfigRepository: UserConfigRepository,
    private readonly userRepository: UserRepository,
    private readonly geminiService: GeminiService,
    private readonly resumeDocumentService: ResumeDocumentService,
    private readonly sseRepository: SseRepository,
    private readonly cache: CacheRepository,
  ) { }

  async execute(body: GenerateResumeInput) {
    const { userId, jobDescription, options } = body;

    const baseData = await this.baseDataRepository.findByUserAndType(
      userId,
      BaseDataType.RESUME,
    );
    if (!baseData) {
      this.sseRepository.sendEvent(
        userId,
        'message',
        'Ops! Não encontramos informações base para gerar o currículo. Por favor, cadastre seus dados primeiro.',
      );
      return;
    }

    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      this.sseRepository.sendEvent(
        userId,
        'message',
        'Usuário não encontrado. Confirme se o ID está correto ou faça login novamente.',
      );
      return;
    }

    const resume = await this.cache.rememberByHash(
      jobDescription,
      900,
      async () =>
        await this.geminiService.generateJsonResponse<Resume>({
          prompt: buildResumePrompt(baseData, jobDescription, options),
          discordData: [`**Tipo**: Currículo`, `**Usuário**: ${userId}`],
        }),
    );

    const savedResume = await this.resumeRepository.create(
      new Resume(
        randomUUID(),
        jobDescription,
        resume.name,
        resume.language,
        resume.role,
        resume.summary,
        options.template ?? SelectedTemplate.DEFAULT,
        resume.skills,
        resume.experiences,
        resume.projects,
        userId,
        new Date(),
      ),
    );

    const contactData = await this.userConfigRepository.findByUserId(userId);

    await this.invalidateCaches(userId, jobDescription);
    await this.resumeDocumentService.generateAndStorePdf(
      savedResume,
      userData,
      contactData,
    );
    this.sseRepository.sendEvent<ResumeItemOutput>(userId, 'resume-generated', {
      id: savedResume.id,
      userId: savedResume.userId,
      prompt: savedResume.prompt,
      template: savedResume.template,
      createdAt: savedResume.createdAt,
    });

    return savedResume;
  }

  private async invalidateCaches(userId: string, value: string) {
    await this.cache.invalidateScope('resume:all', userId);
    await this.cache.invalidateByHash(value);
  }
}
