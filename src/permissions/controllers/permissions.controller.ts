import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Delete, UsePipes, ValidationPipe } from "@nestjs/common";
import { UUID } from "crypto";
import { CreatePermissionDto } from "../dtos/CreatePermission.dto";
import { PermissionsService } from "../services/permissions.service";
import { UpdatePermissionDto } from "../dtos/UpdatePermission.dto";

@Controller("permissions")
@UsePipes(ValidationPipe)
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService
    ){}
    
    @Get()
    getPermissions() {
        return this.permissionsService.getPermissions()
    }

    @Get(":id")
    getPermissionById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.permissionsService.getPermissionById(id)
    }

    @Post()
    createPermission(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.createPermission(createPermissionDto)
    }

    @Put(":id")
    updatePermission(@Param("id", ParseUUIDPipe) id: UUID, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsService.updatePermission(id, updatePermissionDto)
    }

    @Delete(":id")
    deletePermissionById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.permissionsService.deletePermissionById(id);
    }
}