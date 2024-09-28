import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";
import { TaskStatus } from "../entities/status.enum";

export class CreateTaskDto {
    @ApiProperty({
        description: 'Title of the task',
        example: 'Complete the project documentation',
        minLength: 3,
    })
    @IsString()
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'Detailed description of the task',
        example: 'This task involves creating comprehensive documentation for the project.',
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Current status of the task',
        enum: TaskStatus,
        example: TaskStatus.PENDING,
    })
    @IsIn([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
    status: TaskStatus;

    @ApiProperty({
        description: 'Due date for the task',
        example: '2024-09-30',
    })
    @IsNotEmpty()
    @IsString()
    dueDate: string;

    @ApiProperty({
        description: 'ID of the tenant associated with the task',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsNotEmpty()
    @IsUUID()
    tenantId: string;

}
