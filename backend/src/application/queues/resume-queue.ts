import { GenerateResumeInput } from '../models/input/resume.input';

export interface ResumeQueue {
  addGenerateResumeJob(data: GenerateResumeInput): Promise<void>;
}
