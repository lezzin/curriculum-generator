import { GenerateResumeInput } from '../models/input/generate-resume.input';

export interface ResumeQueue {
  addGenerateResumeJob(data: GenerateResumeInput): Promise<void>;
}
