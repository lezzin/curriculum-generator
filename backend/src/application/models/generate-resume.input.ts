import { ResumeOptions } from 'src/domain/shared/interfaces/resume.interfaces';

export interface GenerateResumeInput {
  userId: string;
  jobDescription: string;
  options: ResumeOptions;
}
