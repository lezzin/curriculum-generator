import { ResumeOptions } from "src/domain/shared/interfaces/resume.interfaces";

export interface ResumeQueue {
    addGenerateResumeJob(data: {
        userId: string;
        jobDescription: string,
        options: ResumeOptions
    }): Promise<void>;
}