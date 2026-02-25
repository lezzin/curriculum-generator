import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseType } from '../enum/base-type.enum';

@Entity('users_base', { synchronize: false })
export class UserBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column({ enum: BaseType, unique: true })
    type: string;

    @Column({ name: 'user_id', unique: true })
    userId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
