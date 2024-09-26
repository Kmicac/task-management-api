import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches, MinLength } from 'class-validator';

export class UpdateUserDto  {

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: 'The email should only contain alphanumeric characters and periods',
    })
    email: string;

    @IsUUID()
    tenantId: string;
}
