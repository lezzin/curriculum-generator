import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Table, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    email: string;

    @Column('text')
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}