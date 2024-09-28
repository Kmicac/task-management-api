import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTenantDto {

    @ApiProperty({
        description: 'Name of the Tenant',
        example: 'AuraTech',
        minLength: 3,
      })
      @IsString()
      @IsNotEmpty()
      @MinLength(3)
      name: string;
    
      @ApiProperty({
        description: 'Address of the Tenant',
        example: '123 Main St, Springfield, USA',
      })
      @IsNotEmpty()
      @IsString()
      address: string;
    }
