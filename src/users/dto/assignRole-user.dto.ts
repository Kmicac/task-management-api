import { IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../interfaces/role.enum";


export class AssignRoleDto {

    @IsEnum(Role)
    @IsNotEmpty()
    role: string;
}