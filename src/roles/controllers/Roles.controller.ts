import { Get, Post, Put, Delete, Param, ParseUUIDPipe, Body, Logger, Query} from "@nestjs/common";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { UUID} from "crypto";
import { CreateRoleDto } from "../dtos/CreateRole.dto";
import { UpdateRoleDto } from "../dtos/UpdateRole.dto";
import { RolesService } from "../services/Roles.service";
import { CreateInfoPipe } from "src/common/pipes/transform-pipes/CreateInfoPipe";
import { UpdateInfoPipe } from "src/common/pipes/transform-pipes/UpdateInfoPipe";

@Controller("roles")
export class RolesController {

    constructor(
        private readonly rolesService: RolesService
    ) {}

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

    @Put(":id")
    updateRole(@Param("id", ParseUUIDPipe) id: UUID, @Body(UpdateInfoPipe) updateRoleDto: UpdateRoleDto) {
        return this.rolesService.updateRole(id, updateRoleDto)
    }

    @Delete(":id")
    deleteRoleById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.rolesService.deleteRoleById(id)
    }
}