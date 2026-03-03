import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { Resume } from 'src/domain/entities/resume.entity';
import { ResumeEntity } from '../entities/resume.entity';

@Injectable()
export class TypeOrmResumeRepository implements ResumeRepository {
  constructor(
    @InjectRepository(ResumeEntity)
    private ormRepo: Repository<ResumeEntity>,
  ) { }

  async create(resume: Resume): Promise<Resume> {
    return (await this.ormRepo.save(resume)) as Resume;
  }

  async getAll(userId: string): Promise<Resume[]> {
    return (await this.ormRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })) as Resume[];
  }

  async findById(id: string): Promise<Resume | null> {
    return (await this.ormRepo.findOneBy({ id })) as Resume;
  }

  async remove(id: string): Promise<void> {
    await this.ormRepo.delete(id)
  }
}
