import { Get, Post, Put, Delete, Param, ParseUUIDPipe, Body, Logger, Query, Req, RawBodyRequest, UsePipes, ValidationPipe} from "@nestjs/common";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { UUID } from "crypto";
import { CreateRoleDto } from "../dtos/CreateRole.dto";
import { UpdateRoleDto } from "../dtos/UpdateRole.dto";
import { RolesService } from "../services/Roles.service";
import { CreateInfoPipe } from "src/common/pipes/transform-pipes/CreateInfoPipe";
import { UpdateInfoPipe } from "src/common/pipes/transform-pipes/UpdateInfoPipe";
import { ModifyRoleDto } from "../dtos/ModifyRole.dto";

@Controller("roles")
@UsePipes(ValidationPipe)
export class RolesController {

    constructor(
        private readonly rolesService: RolesService
    ) { }

    @Get()
    getRoles(@Query("name") name: string, @Query("description") description: string) {
        return this.rolesService.getRoles(name, description)
    }

    @Get(":id")
    getRoleById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.rolesService.getRoleById(id)
    }

    @Post()
    createRole(@Body(CreateInfoPipe) createRoleDto: CreateRoleDto) {
        return this.rolesService.createRole(createRoleDto)
    }

    @Post("modify")
    async modifyRoles(@Body() modifyRoleDto: ModifyRoleDto) {
        console.log("controller------------------------------------------")
        console.log("createRoleDtos")
        console.log(modifyRoleDto.createRoleDtos)
        console.log("updateRoleDtos")
        console.log(modifyRoleDto.updateRoleDtos)
        console.log("deletedIds")
        console.log(modifyRoleDto.deletedIds)
        return this.rolesService.modifyRoles(modifyRoleDto.createRoleDtos, modifyRoleDto.updateRoleDtos, modifyRoleDto.deletedIds)
    }

    @Put()
    updateRole(@Body(UpdateInfoPipe) updateRoleDto: UpdateRoleDto) {
        return this.rolesService.updateRole(updateRoleDto)
    }

    @Delete(":id")
    deleteRoleById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.rolesService.deleteRoleById(id)
    }
}