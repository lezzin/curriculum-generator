import { BaseDataType } from 'src/domain/enums/base-data-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users_base', { synchronize: false })
export class BaseDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ enum: BaseDataType, unique: true })
  type: BaseDataType;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
