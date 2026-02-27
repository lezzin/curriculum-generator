import { GenerateResumeInput } from "../models/generate-resume.input";

export interface ResumeQueue {
    addGenerateResumeJob(data: GenerateResumeInput): Promise<void>;
}