import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

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
