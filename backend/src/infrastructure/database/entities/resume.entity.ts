import { Language, SelectedTemplate } from 'src/domain/enums/resume.enums';
import {
  ResumeExperience,
  ResumeProject,
} from 'src/domain/types/resume.types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('resume', { synchronize: false })
export class ResumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prompt: string;

  @Column()
  name: string;

  @Column()
  language: Language;

  @Column()
  role: string;

  @Column()
  summary: string;

  @Column()
  template: SelectedTemplate;

  @Column('text', { array: true })
  skills: string[];

  @Column('jsonb')
  experiences: ResumeExperience[];

  @Column('jsonb', { nullable: true })
  projects: ResumeProject[];

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
