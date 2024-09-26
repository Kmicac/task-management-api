import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Tenant } from "../../tenants/entities/tenant.entity";
import { TaskStatus } from "./status.enum";



@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text'
})
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
        (tenant) => tenant.tasks,)
    tenant: Tenant;

    @Column()
    dueDate: string;

}
