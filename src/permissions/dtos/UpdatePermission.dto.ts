import { IsNotEmpty } from "class-validator";

export class UpdatePermissionDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
}