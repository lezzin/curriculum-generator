import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Table,
  UpdateDateColumn,
} from 'typeorm';
import { UserProviderEntity } from './user-provider.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column({ type: 'varchar', nullable: true })
  picture?: string | null;

  @Column({ type: 'text', nullable: true })
  password?: string | null;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken?: string | null;

  @OneToMany(() => UserProviderEntity, (provider) => provider.user, {
    cascade: true,
    eager: true,
  })
  providers: UserProviderEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
