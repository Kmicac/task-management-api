import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Name of the user',
        minLength: 4,
        example: 'John Doe',
      })
      @IsString()
      @MinLength(4)
      @IsNotEmpty()
      name: string;
    
      @ApiProperty({
        description: 'Email of the user, must be a valid email format',
        example: 'john.doe@outlook.com',
      })
      @IsEmail()
      @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: 'The email should only contain alphanumeric characters and periods',
      })
      email: string;
    
      @ApiProperty({
        description: 'Password of the user, must contain uppercase, lowercase letters, and a number',
        minLength: 6,
        maxLength: 50,
        example: 'StrongP@ssw0rd',
      })
      @IsString()
      @MinLength(6)
      @MaxLength(50)
      @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have an uppercase, lowercase letter, and a number',
      })
      password: string;
    
      @ApiProperty({
        description: 'Role of the user, must be either Admin or User',
        enum: ['Admin', 'User'],
        example: 'User',
      })
      @IsEnum(['Admin', 'User'])
      role: string;
    
      @ApiProperty({
        description: 'ID of the tenant to which the user belongs',
        example: '725d1d2a-16f2-4829-ac35-8bf9c84dcd61',
      })
      @IsNotEmpty()
      @IsUUID()
      tenantId: string;
    }