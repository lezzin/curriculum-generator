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
  language: string;

  @Column()
  role: string;

  @Column()
  summary: string;

  @Column('text', { array: true })
  skills: string[];

  @Column('jsonb')
  experiences: any;

  @Column('jsonb', { nullable: true })
  projects: any;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
