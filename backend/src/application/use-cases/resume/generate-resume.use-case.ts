import { ResumeQueue } from "src/application/queues/resume-queue";
import { ResumeOptions } from "src/domain/shared/interfaces/resume.interfaces";

export class GenerateResumeUseCase {
    constructor(
        private readonly resumeQueue: ResumeQueue,
    ) { }

    async execute(userId: string, jobDescription: string, options: ResumeOptions) {
        await this.resumeQueue.addGenerateResumeJob({
            userId,
            jobDescription,
            options
        });

        return { message: "Solicitação enviada para processamento!" };
    }
}