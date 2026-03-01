import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('users_providers')
export class UserProviderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    provider: string

    @Column({ name: 'provider_id' })
    providerId: string

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => UserEntity, user => user.providers)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity
}