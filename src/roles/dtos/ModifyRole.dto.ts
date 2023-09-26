import {IsUUID, ValidateNested } from "class-validator";
import { CreateRoleDto } from "./CreateRole.dto";
import { UUID } from "crypto";
import { Type } from "class-transformer";
import { UpdateRoleDto } from "./UpdateRole.dto";

export class ModifyRoleDto {
    @ValidateNested({each: true})
    @Type(() => CreateRoleDto)
    createRoleDtos: CreateRoleDto[];

    @ValidateNested({each: true})
    @Type(() => UpdateRoleDto)
    updateRoleDtos: UpdateRoleDto[];

    @IsUUID(4, {each: true})
    deletedIds: UUID[];
}