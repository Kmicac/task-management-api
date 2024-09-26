import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTenantDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

}
