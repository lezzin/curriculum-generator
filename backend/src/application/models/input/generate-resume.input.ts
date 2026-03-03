import { FocusArea, Language, Market, SelectedTemplate, TargetSeniority } from "src/domain/shared/enums/resume.enums";

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
