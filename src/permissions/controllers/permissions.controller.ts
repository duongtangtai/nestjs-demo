import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Delete, UsePipes, ValidationPipe } from "@nestjs/common";
import { UUID } from "crypto";
import { CreatePermissionDto } from "../dtos/CreatePermission.dto";
import { PermissionsService } from "../services/permissions.service";
import { UpdatePermissionDto } from "../dtos/UpdatePermission.dto";
import { CreateInfoPipe } from "src/common/pipes/transform-pipes/CreateInfoPipe";
import { UpdateInfoPipe } from "src/common/pipes/transform-pipes/UpdateInfoPipe";

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
    createPermission(@Body(CreateInfoPipe) createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.createPermission(createPermissionDto)
    }

    @Put(":id")
    updatePermission(@Param("id", ParseUUIDPipe) id: UUID, @Body(UpdateInfoPipe) updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsService.updatePermission(id, updatePermissionDto)
    }

    @Delete(":id")
    deletePermissionById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.permissionsService.deletePermissionById(id);
    }
}