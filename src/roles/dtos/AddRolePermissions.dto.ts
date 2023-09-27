import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class AddRolePermissionsDto {
    @IsUUID()
    roleId: UUID;

    @IsNotEmpty()
    permissionNames: string[];
}