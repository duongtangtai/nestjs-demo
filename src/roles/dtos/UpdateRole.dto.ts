import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class UpdateRoleDto {
    @IsNotEmpty()
    @IsUUID()
    id: UUID;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
}