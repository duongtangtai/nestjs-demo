import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { Permission } from "src/common/entities/Permission.entity";
import { Role } from "src/common/entities/Role.entity";
import { RequestService } from "src/common/services/Request.service";
import { PERMISSION_KEY } from "src/utils/constants";
import { formatDate } from "src/utils/DateFormatted";
import { error, response } from "src/utils/ResponseUtils";
import { In, Like, Repository } from "typeorm";

@Injectable()
export class RolesService {
    private readonly logger = new Logger(RolesService.name)

    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
        private readonly requestService: RequestService,
    ) { }

    async getRoles(name: string, description: string) {
        console.log("name: ", name)
        console.log("description: ", description)
        name = name.toUpperCase();
        description = description.toUpperCase();
        const roles = await this.roleRepository.find({
            where: {
                name: Like(`${name}%`),
                description: Like(`${description}%`)
            },
            order: {
                created_at: "ASC"
            },
            relations: [PERMISSION_KEY]
        })
        try {
            this.logger.debug("getRoles")
            return response(roles.map(role => {
                const { id, name, description, permissions } = role
                // return { id, name, description, permissions: permissions.map(e => { return {id: e.id, name: e.name, description: e.description} }) }
                return { id, name, description, permissionNames: permissions.map(e => e.name)}
            }), HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async getRoleById(inputId: UUID) {
        try {
            this.logger.debug("getRoleById")
            const role: Role = await this.roleRepository.findOneBy({ id: inputId })
            if (!role) {
                return error("Role not found", HttpStatus.BAD_REQUEST);
            }

            const { id, name, description } = role;
            return response({ id, name, description }, HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async createRole(createRoleParams: CreateRoleParams) {
        try {
            this.logger.debug("createRole")
            const newRole: Role = this.roleRepository.create({ ...createRoleParams })
            const savedRole: Role = await this.roleRepository.save({
                ...newRole,
            })
            const { id, name, description } = savedRole;
            return response({ id, name, description }, HttpStatus.CREATED)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async modifyRoles(createRoleParams: CreateRoleParams[], updateRoleParams: UpdateRoleParams[], deletedIds: UUID[]) {
        try {
            //STEP 1 : DELETE
            if (deletedIds.length > 0) {
                await this.roleRepository.delete(deletedIds)
            }

            //STEP 2 : UPDATE
            updateRoleParams.forEach(async role => {
                const existedRole = await this.roleRepository.findOneBy({ id: role.id })
                if (!existedRole) {
                    return error(`Role not found with id ${role.id}`, HttpStatus.BAD_REQUEST)
                }
                console.log("permissionNames:")
                console.log(role.permissionNames)
                const permissions = await this.permissionRepository.findBy({name: In(role.permissionNames)});
                existedRole.permissions = permissions;
                await this.roleRepository.save({
                    ...existedRole,
                    name: role.name,
                    description: role.description,
                    updated_by: this.requestService.getUserData().username,
                })
            })

            //STEP 3 : CREATE
            createRoleParams.forEach(async role => {
                const newRole = this.roleRepository.create({ ...role })
                const permissions = await this.permissionRepository.findBy({name: In(role.permissionNames)});
                await this.roleRepository.save({
                    ...newRole,
                    permissions,
                    created_by: this.requestService.getUserData().username,
                    updated_by: this.requestService.getUserData().username,
                })
            })
            return response("Saved successfully", HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async updateRole(updateRoleParams: UpdateRoleParams) {
        try {
            this.logger.debug("updateRole")
            const role: Role = await this.roleRepository.findOneBy({ id: updateRoleParams.id })
            if (!role) {
                return error("Role not found", HttpStatus.BAD_REQUEST)
            }

            const updatedRole: Role = await this.roleRepository.save({
                ...role,
                ...updateRoleParams,
            })

            const { id, name, description } = updatedRole;
            return response({ id, name, description }, HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async deleteRoleById(id: UUID) {
        try {
            this.logger.debug("deleteRoleById")
            const role = await this.roleRepository.findOneBy({ id });
            if (!role) {
                return error("Role not found", HttpStatus.BAD_REQUEST)
            }
            await this.roleRepository.delete(id)
            return response("Deleted role successfully", HttpStatus.OK);
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async addRolePermissions(addRolePermissionsParams: AddRolePermissionsParams) {
        try {
            //find role
            const role = await this.roleRepository.findOne({ where: { id: addRolePermissionsParams.roleId }, relations: ["permissions"] })
            if (!role) {
                return error("Role not found", HttpStatus.BAD_REQUEST)
            }
            //find permissions
            const permissions = await this.permissionRepository.find({ where: { name: In([...addRolePermissionsParams.permissionNames]) } });
            role.permissions = permissions;
            const savedRole = await this.roleRepository.save({
                ...role,
                updated_by: this.requestService.getUserData().username,
                updated_at: formatDate(new Date())
            })
            return response(savedRole, HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async getPermissionsByRoleNames(roleNames: string[]) {
        try {
            const roles = await this.roleRepository.find({
                where: {
                    name: In(roleNames)
                },
                relations: [PERMISSION_KEY]
            })
            const permissions = new Set<string>();
            roles.forEach(role => role.permissions.forEach(permission => permissions.add(permission.name)))
            return Array.from(permissions);
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}