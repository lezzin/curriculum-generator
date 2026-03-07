import { Resume } from '../entities/resume.entity';
import { PaginatedResult } from '../interfaces/paginate.interfaces';

export abstract class ResumeRepository {
  abstract create(resume: Resume): Promise<Resume>;
  abstract findById(id: string): Promise<Resume | null>;

  abstract paginate(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<Resume>>

  abstract remove(resumeId: string): Promise<void>;
}
