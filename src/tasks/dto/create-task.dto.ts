import { IsIn, IsString, MinLength } from "class-validator";
import { TaskStatus } from "../entities/status.enum";

export class CreateTaskDto {

    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    description: string;


    @IsIn([TaskStatus.PENDING , TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
        { message: 'Status must be pending, in_progress, or completed' }
    )
    status: TaskStatus;
}
