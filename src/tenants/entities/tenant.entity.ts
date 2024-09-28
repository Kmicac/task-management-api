import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Task } from "../../tasks/entities/task.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Tenant {

    @ApiProperty({
        description: 'Unique identifier for the tenant',
        example: 'dcb8a7b4-3d0e-4b2b-9a0e-ec9b1e9b09b2',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Name of the tenant',
        example: 'Test Tenant',
    })
    @Column()
    name: string;

    @ApiProperty({
        description: 'Address of the tenant',
        example: '123 Main St, City, Country',
    })
    @Column()
    address: string;

    @ApiProperty({
        description: 'The date and time when the tenant was created',
        type: 'string',
        format: 'date-time',
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({
        description: 'List of users associated with the tenant',
        type: () => User, 
        isArray: true,
    })
    @OneToMany(() => User, (user) => user.tenant, { onDelete: 'CASCADE' })
    users: User[];

    @ApiProperty({
        description: 'List of tasks associated with the tenant',
        type: () => Task, 
        isArray: true,
    })
    @OneToMany(() => Task, (task) => task.tenant, { onDelete: 'CASCADE' })
    tasks: Task[];
}