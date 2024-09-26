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
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => User,
        (user) => user.tenant,
        { onDelete: 'CASCADE' }
    )
    users: User[];

    @OneToMany(() => Task,
        (task) => task.tenant,
        { onDelete: 'CASCADE' }
    )
    tasks: Task[];
}
