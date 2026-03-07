import { PaginateInput } from 'src/application/models/input/paginate.input';
import { ResumeItemOutput } from 'src/application/models/output/get-all-resumes.output';
import { Resume } from 'src/domain/entities/resume.entity';
import { PaginatedResult } from 'src/domain/interfaces/paginate.interfaces';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';

export class GetAllResumesUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
  ) { }

  async execute(body: PaginateInput): Promise<PaginatedResult<ResumeItemOutput>> {
    const resumes = await this.resumeRepository.paginate(body.userId, body.page, body.limit);

    return {
      ...resumes,
      data: resumes.data.map(this.toOutput),
    };
  }

  private toOutput(resume: Resume): ResumeItemOutput {
    return {
      id: resume.id,
      userId: resume.userId,
      prompt: resume.prompt,
      template: resume.template,
      createdAt: resume.createdAt,
    };
  }
}
