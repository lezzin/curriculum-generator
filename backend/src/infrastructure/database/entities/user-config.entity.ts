import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users_config')
export class UserConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'linkedin_link',
  })
  linkedin: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'github_link',
  })
  github: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'portfolio_link',
  })
  portfolio: string;

  @Column({
    type: 'varchar',
    length: 15,
  })
  cellphone: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
