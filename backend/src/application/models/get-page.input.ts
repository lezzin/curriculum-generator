import { SelectedTemplate } from 'src/domain/shared/enums/resume.enums';

export interface GetPageInput {
  id: string;
  template?: SelectedTemplate;
}
