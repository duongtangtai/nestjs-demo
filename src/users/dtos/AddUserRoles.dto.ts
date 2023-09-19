import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";


export class AddUserRolesDto {
    @IsUUID()
    userId: UUID;

    @IsNotEmpty()
    roleNames: string[];
}