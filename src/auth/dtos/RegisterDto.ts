import { IsNotEmpty, IsEmail} from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}