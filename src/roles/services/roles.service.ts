import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { Role } from "src/common/entities/Role.entity";
import { RequestService } from "src/common/services/Request.service";
import { formatDate } from "src/utils/DateFormatted";
import { error, response } from "src/utils/ResponseUtils";
import { In, Repository } from "typeorm";

@Injectable()
export class RolesService {
    private readonly logger = new Logger(RolesService.name)

    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        private readonly requestService: RequestService,
    ) { }

    async getRoles(name: string, description: string) {
        console.log("name: ", name)
        console.log("description: ", description)
        name = name.toUpperCase();
        description = description.toUpperCase();
        let roles: Role[];
        roles = await this.roleRepository.query(`
            SELECT * 
            FROM ROLES
            WHERE UPPER(NAME) LIKE '${name}%'
            AND UPPER(DESCRIPTION) LIKE '${description}%'
        `)
        console.log(roles)
        try {
            this.logger.debug("getRoles")
            return response(roles.map(role => {
                const { id, name, description } = role
                return { id, name, description }
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

    async modifyRoles(createRoleParams: CreateRoleParams[], updateRoleParams: UpdateRoleParams[], deletedIds: string[]) {
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
                await this.roleRepository.save({
                    ...existedRole,
                    ...role,
                    updated_by: this.requestService.getUserData().username,
                })
            })

            //STEP 3 : CREATE
            createRoleParams.forEach(async role => {
                const newRole = this.roleRepository.create({ ...role })
                await this.roleRepository.save({
                    ...newRole,
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
}