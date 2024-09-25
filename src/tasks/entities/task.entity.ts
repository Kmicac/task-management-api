import { Tenant } from "src/tenants/entities/tenant.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { TaskStatus } from "./status.enum";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING
    })
    status: string;


    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Tenant,
        (tenant) => tenant.tasks,
        { onDelete: 'CASCADE' })
    tenant: Tenant;

}
