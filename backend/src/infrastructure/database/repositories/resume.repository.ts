import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { Resume } from 'src/domain/entities/resume.entity';
import { ResumeEntity } from '../entities/resume.entity';
import { PaginatedResult } from 'src/domain/interfaces/paginate.interfaces';

@Injectable()
export class TypeOrmResumeRepository implements ResumeRepository {
  constructor(
    @InjectRepository(ResumeEntity)
    private ormRepo: Repository<ResumeEntity>,
  ) { }

  async create(resume: Resume): Promise<Resume> {
    return (await this.ormRepo.save(resume)) as Resume;
  }

  async paginate(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<Resume>> {
    const query = this.ormRepo
      .createQueryBuilder('resume')
      .where('resume.userId = :userId', { userId })
      .orderBy('resume.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return {
      data: data.map(this.toDomain),
      total,
      page,
      limit
    }
  }

  async findById(id: string): Promise<Resume | null> {
    return (await this.ormRepo.findOneBy({ id })) as Resume;
  }

  async remove(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  private toDomain(entity: ResumeEntity): Resume {
    const user = new Resume(
      entity.id,
      entity.prompt,
      entity.name,
      entity.language,
      entity.role,
      entity.summary,
      entity.template,
      entity.skills,
      entity.experiences,
      entity.projects,
      entity.userId,
      entity.createdAt
    );

    return user;
  }
}
