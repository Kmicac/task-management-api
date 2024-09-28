import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Tenant } from "../../tenants/entities/tenant.entity";
import { TaskStatus } from "./status.enum";
import { ApiProperty } from "@nestjs/swagger";



@Entity()
export class Task {

    @ApiProperty({
        description: 'Unique identifier for the task',
        example: 'c8a7c10b-0f7c-4b9e-9a80-e5c4a07bfb66',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Title of the task',
        example: 'Complete project report',
    })
    @Column({ type: 'text' })
    title: string;

    @ApiProperty({
        description: 'Detailed description of the task',
        example: 'Prepare and submit the final project report to the stakeholders.',
    })
    @Column('text')
    description: string;

    @ApiProperty({
        description: 'Current status of the task',
    })
    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status: string;

    @ApiProperty({
        description: 'The date and time when the task was created',
        type: 'string',
        format: 'date-time',
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({
        description: 'Tenant associated with the task',
        type: () => Tenant, 
    })
    @ManyToOne(() => Tenant, (tenant) => tenant.tasks)
    tenant: Tenant;

    @ApiProperty({
        description: 'Due date for completing the task',
        type: 'string',
        format: 'date', 
        example: '2024-12-31',
    })
    @Column()
    dueDate: string;
}