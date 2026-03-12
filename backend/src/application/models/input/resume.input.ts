import {
  FocusArea,
  Language,
  Market,
  SelectedTemplate,
  TargetSeniority,
} from 'src/domain/enums/resume.enums';

export interface ResumeOptions {
  language: Language;
  targetSeniority: TargetSeniority;
  focusArea: FocusArea;
  market: Market;
  template?: SelectedTemplate;
}

export interface GenerateResumeInput {
  userId: string;
  jobDescription: string;
  options: ResumeOptions;
}

export interface GetPageInput {
  id: string;
  template?: SelectedTemplate;
}

export interface RemoveResumeInput {
  resumeId: string;
  userId: string;
}
