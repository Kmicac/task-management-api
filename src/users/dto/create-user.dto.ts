import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, IsPassportNumber, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: 'The email should only contain alphanumeric characters and periods',
    })
    email: string;

    @IsNotEmpty()
    password: string;


    @IsEnum(['Admin', 'User'], { message: 'Role must be either Admin or User' })
    role: string;

    @IsNotEmpty()
    tenantId: string;
}
