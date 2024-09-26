import { IsIn, IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";
import { TaskStatus } from "../entities/status.enum";

export class CreateTaskDto {

    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    description: string;

    @IsIn([TaskStatus.PENDING , TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
    status: TaskStatus;

    @IsNotEmpty()
    @IsString()
    dueDate: string;

    @IsNotEmpty()
    @IsUUID()
    tenantId: string;
}
