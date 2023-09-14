import { Get, Post, Put, Delete, Param, ParseUUIDPipe, Body, Logger} from "@nestjs/common";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { UUID} from "crypto";
import { CreateRoleDto } from "../dtos/CreateRole.dto";
import { UpdateRoleDto } from "../dtos/UpdateRole.dto";
import { RolesService } from "../services/Roles.service";

@Controller("roles")
export class RolesController {

    constructor(
        private readonly rolesService: RolesService
    ) {}

    @Get()
    getRoles() {
        return this.rolesService.getRoles()
    }

    @Get(":id")
    getRoleById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.rolesService.getRoleById(id)
    }

    @Post()
    createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.createRole(createRoleDto)
    }

    @Put(":id")
    updateRole(@Param("id", ParseUUIDPipe) id: UUID, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.updateRole(id, updateRoleDto)
    }

    @Delete(":id")
    deleteRoleById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.rolesService.deleteRoleById(id)
    }
}