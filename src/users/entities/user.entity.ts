import { Tenant } from "src/tenants/entities/tenant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['Admin', 'User'], default: 'User' })
    role: string;

    @ManyToOne(() => Tenant,
        (tenant) => tenant.users)
    tenant: Tenant;

    @CreateDateColumn()
    createdAt: Date;
}
