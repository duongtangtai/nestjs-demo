import { Get, Post, Put, Delete, Param, ParseUUIDPipe, Body, Logger, Query, Req, RawBodyRequest} from "@nestjs/common";
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

    @Post("many")
    async createRoles(@Req() req: RawBodyRequest<Request>) {
        console.log("controller------------------------------------------")
        console.log(req.body)
        const formObj = req.body
        // console.log(createRoleDtos)
        // return this.rolesService.createRoles(createRoleDtos)
        let dtos = [];
        let index : string = "";
        for (const key in formObj) {
            const arr = key.split("_");
            if (arr[0] !== index) { //new item
                index = arr[0];
                dtos.push({
                    [arr[1]] : formObj[key]
                })
            } else { //old item
                dtos[arr[0]] = {
                    ...dtos[arr[0]],
                    [arr[1]] : formObj[key]
                }
            }
        }
        console.log("finish")
        console.log(dtos)
        return "hehe"
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