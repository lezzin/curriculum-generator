import { Resume } from '../entities/resume.entity';
import { UserConfig } from '../entities/user.config.entity';
import { User } from '../entities/user.entity';

export abstract class ResumeDocumentRepository {
  abstract generateHtml(
    resume: Resume,
    user: User,
    userConfig: UserConfig | null,
    format: 'page' | 'pdf',
  ): string;

  abstract generatePdf(
    resume: Resume,
    user: User,
    userConfig: UserConfig | null,
  ): Promise<Buffer | null>;
}
