import { SelectedTemplate } from "src/domain/shared/enums/resume.enums";

export interface ResumeItemOutput {
    id: string,
    prompt: string,
    template: SelectedTemplate,
    createdAt: Date,
}

export interface GetAllResumesOutput {
    items: ResumeItemOutput[];
    total: number;
}