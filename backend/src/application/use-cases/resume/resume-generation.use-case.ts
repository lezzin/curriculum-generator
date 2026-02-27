import { randomUUID } from "crypto";
import { GenerateResumeInput } from "src/application/models/generate-resume.input";
import { Resume } from "src/domain/entities/resume.entity";
import { BaseDataRepository } from "src/domain/repositories/base-data.repository";
import { CacheRepository } from "src/domain/repositories/cache.repository";
import { ResumeRepository } from "src/domain/repositories/resume.repository";
import { UserConfigRepository } from "src/domain/repositories/user-config.repository";
import { UserRepository } from "src/domain/repositories/user.repository";
import { REMEMBER_RESUMES_CACHE_PREFIX } from "src/domain/shared/constants/cache.constants";
import { BaseDataType } from "src/domain/shared/enums/base-data-type.enum";
import { Language, SelectedTemplate } from "src/domain/shared/enums/resume.enums";
import { generateHash, makeCacheKey } from "src/domain/shared/helpers/cache-key.helper";
import { buildResumePrompt } from "src/domain/shared/helpers/resume-prompt.helper";
import { GeminiService } from "src/infrastructure/services/gemini.service";
import { PdfService } from "src/infrastructure/services/pdf.service";
import { SseService } from "src/infrastructure/services/sse.service";

export class ResumeGenerationUseCase {
    constructor(
        private readonly resumeRepository: ResumeRepository,
        private readonly baseDataRepository: BaseDataRepository,
        private readonly userConfigRepository: UserConfigRepository,
        private readonly userRepository: UserRepository,
        private readonly geminiService: GeminiService,
        private readonly pdfService: PdfService,
        private readonly sseService: SseService,
        private readonly cache: CacheRepository,
    ) { }

    async execute(body: GenerateResumeInput) {
        const { userId, jobDescription, options } = body;

        const baseData = await this.baseDataRepository.findDescriptionByUserAndType(userId, BaseDataType.RESUME)
        if (!baseData) return;

        const userData = await this.userRepository.findById(userId)
        if (!userData) return;

        const promptKey = generateHash(jobDescription)

        const resume = await this.cache.remember(
            promptKey,
            900,
            async () => await this.geminiService.generateJsonResponse<Resume>({
                prompt: buildResumePrompt(baseData, jobDescription, options),
                discordData: [
                    `**Tipo**: Currículo`,
                    `**Usuário**: ${userId}`,
                ]
            })
        )

        const savedResume = await this.resumeRepository.create(new Resume(
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
            userId
        ))

        const contactData = await this.userConfigRepository.getByUserId(userId);

        await this.invalidateCaches(userId, promptKey)
        await this.pdfService.generateResumePdfByEntities(savedResume, userData, contactData);
        this.sseService.sendEvent(userId, 'resume-generated', savedResume);

        return savedResume;
    }

    private async invalidateCaches(userId: string, promptKey: string) {
        await this.cache.del(makeCacheKey(REMEMBER_RESUMES_CACHE_PREFIX, userId));
        await this.cache.del(promptKey);
    }
}