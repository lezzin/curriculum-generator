import { SelectedTemplate } from 'src/domain/enums/resume.enums';

export interface GetPageInput {
  id: string;
  template?: SelectedTemplate;
}
