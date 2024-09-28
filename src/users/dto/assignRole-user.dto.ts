import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../interfaces/role.enum";

export class AssignRoleDto {
    @ApiProperty({
        description: 'Role to be assigned to the user',
        enum: Role,
        example: 'Admin'
    })
    @IsEnum(Role)
    @IsNotEmpty()
    role: string;

}