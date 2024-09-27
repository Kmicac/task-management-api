import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({
        select: false,
    })
    password: string;

    @Column({ type: 'enum', enum: ['Admin', 'User'], default: 'User' })
    role: string;

    @ManyToOne(() => Tenant,
        (tenant) => tenant.users)
    tenant: Tenant;

    @CreateDateColumn()
    createdAt: Date;
}
