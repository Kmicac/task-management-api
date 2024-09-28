import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity()
export class User {

    @ApiProperty({
        description: 'Unique identifier for the user',
        example: 'e1c2d3f4-5678-90ab-cdef-1234567890ab',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Name of the user, must be unique',
        example: 'John Doe',
    })
    @Column({ unique: true })
    name: string;

    @ApiProperty({
        description: 'Email address of the user, must be unique',
        example: 'johndoe@example.com',
    })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        description: 'Password of the user (not included in responses)',
        example: 'password123',
    })
    @Column({
        select: false,
    })
    password: string;

    @ApiProperty({
        description: 'Role of the user',
        enum: ['Admin', 'User'],
        default: 'User',
    })
    @Column({ type: 'enum', enum: ['Admin', 'User'], default: 'User' })
    role: string;

    @ManyToOne(() => Tenant,
        (tenant) => tenant.users)
    @ApiProperty({
        description: 'Tenant to which the user belongs',
        type: () => Tenant,
    })
    tenant: Tenant;

    @ApiProperty({
        description: 'Date when the user was created',
        type: 'string',
        format: 'date-time',
    })
    @CreateDateColumn()
    createdAt: Date;
}