import { Language, SelectedTemplate } from '../enums/resume.enums';
import { ResumeExperience, ResumeProject } from '../types/resume.types';

export class Resume {
  constructor(
    public readonly id: string,
    public prompt: string,
    public name: string,
    public language: Language,
    public role: string,
    public summary: string,
    public template: SelectedTemplate,
    public skills: string[],
    public experiences: ResumeExperience[],
    public projects: ResumeProject[],
    public userId: string,
    public readonly createdAt: Date,
  ) {}
}
