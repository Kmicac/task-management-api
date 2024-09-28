import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        description: 'Email of the user, must be a valid email format and contain alphanumeric characters',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: 'The email should only contain alphanumeric characters and periods',
    })
    email: string;

    @ApiProperty({
        description: 'Password for the user, must be between 6 and 50 characters and include at least one uppercase letter, one lowercase letter, and one number',
        minLength: 6,
        maxLength: 50,
        example: 'StrongP@ssw0rd',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have an Uppercase, lowercase letter and a number',
    })
    password: string;

}
