import { SelectedTemplate } from 'src/domain/enums/resume.enums';

export interface ResumeItemOutput {
  id: string;
  userId: string;
  prompt: string;
  template: SelectedTemplate;
  createdAt: Date;
}

export interface GetAllResumesOutput {
  items: ResumeItemOutput[];
  total: number;
}
