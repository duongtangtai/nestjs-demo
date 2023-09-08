import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UUID } from "crypto";
import { CreatePermissionDto } from "../dtos/CreatePermissionDto";

@Controller("permissions")
@UsePipes(ValidationPipe)
export class PermissionsController {
    @Get()
    getPermissions() {

    }

    @Get(":id")
    getPermissionById(@Param("id", ParseUUIDPipe) id: UUID) {
        
    }

    @Post()
    createPermission(@Body() createPermissionDto: CreatePermissionDto) {

    }
}