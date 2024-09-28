import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches, MinLength } from 'class-validator';

export class UpdateUserDto  {

    @ApiProperty({
        description: 'Name of the user, must be at least 4 characters long',
        minLength: 4,
        example: 'John Doe',
      })
      @IsString()
      @MinLength(4)
      @IsNotEmpty()
      name: string;
    
      @ApiProperty({
        description: 'Email of the user, must be a valid email format',
        example: 'john.doe@hotmail.com',
      })
      @IsEmail()
      @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: 'The email should only contain alphanumeric characters and periods',
      })
      email: string;
    
      @ApiProperty({
        description: 'ID of the tenant to which the user belongs',
        example: '725d1d2a-16f2-4829-ac35-8bf9c84dcd61',
      })
      @IsUUID()
      tenantId: string;
    }
