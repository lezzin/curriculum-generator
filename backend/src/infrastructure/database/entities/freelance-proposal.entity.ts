import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Entity,
} from 'typeorm';

@Entity('freelance_proposal')
export class FreelanceProposalEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    prompt: string;

    @Column('text')
    message: string;

    @Column('int', { name: 'bid_amount' })
    bidAmount: number;

    @Column('int', { name: 'delivery_days' })
    deliveryDays: number;

    @Column({ name: 'user_id' })
    userId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}