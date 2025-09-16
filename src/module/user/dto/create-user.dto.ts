import { IsNotEmpty, IsOptional, IsEmail, IsPhoneNumber} from "class-validator";
export class CreateUserDto {
    @IsNotEmpty({message:" Name is not emty!"})  
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty({message:" Password is not emty!"})
    password: string

    @IsPhoneNumber('VN')
    phone : string

    @IsOptional()
    image: string

    @IsOptional()
    address: string

}
