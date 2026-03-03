import { Language, SelectedTemplate } from '../shared/enums/resume.enums';

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
    public experiences: any,
    public projects: any,
    public userId: string,
    public readonly createdAt: Date,
  ) {}
}
