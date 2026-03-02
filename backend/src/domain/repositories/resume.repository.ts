import { Resume } from '../entities/resume.entity';

export abstract class ResumeRepository {
  abstract create(resume: Resume): Promise<Resume>;
  abstract findById(id: string): Promise<Resume | null>;
  abstract getAll(userId: string): Promise<Resume[]>;
}
