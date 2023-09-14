import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { Role } from "src/common/entities/Role.entity";
import { RequestService } from "src/common/services/Request.service";
import { error, response } from "src/utils/ResponseUtils";
import { Repository } from "typeorm";

@Injectable()
export class RolesService {
    private readonly logger = new Logger(RolesService.name)

    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        private readonly requestService: RequestService
    ) { }

    async getRoles() {
        try {
            this.logger.debug("getRoles")
            return response((await this.roleRepository.find()).map(role => {
                const { id, name, description } = role
                return { id, name, description }
            }), HttpStatus.OK)
        } catch (e) {
            throw new HttpException(e.detail, HttpStatus.BAD_REQUEST)
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
            throw new HttpException(e.detail, HttpStatus.BAD_REQUEST)
        }
    }

    async createRole(createRoleParams: CreateRoleParams) {
        try {
            this.logger.debug("createRole")
            const newRole: Role = this.roleRepository.create({ ...createRoleParams })
            const savedRole: Role = await this.roleRepository.save({
                ...newRole,
                createdBy: this.requestService.getUserData().username,
                updatedBy: this.requestService.getUserData().username
            })
            const { id, name, description } = savedRole;
            return response({ id, name, description }, HttpStatus.CREATED)
        } catch (e) {
            throw new HttpException(e.detail, HttpStatus.BAD_REQUEST)
        }
    }

    async updateRole(inputId: UUID, updateRoleParams: UpdateRoleParams) {
        try {
            this.logger.debug("updateRole")
            const role: Role = await this.roleRepository.findOneBy({ id: inputId })
            if (!role) {
                return error("Role not found", HttpStatus.BAD_REQUEST)
            }

            const updatedRole: Role = await this.roleRepository.save({
                ...role,
                ...updateRoleParams,
                updatedBy: this.requestService.getUserData().username,
            })

            const { id, name, description } = updatedRole;
            return response({ id, name, description }, HttpStatus.OK)
        } catch (e) {
            throw new HttpException(e.detail, HttpStatus.BAD_REQUEST)
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
            throw new HttpException(e.detail, HttpStatus.BAD_REQUEST)
        }
    }
}