import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { Permission } from "src/common/entities/Permission.entity";
import { RequestService } from "src/common/services/Request.service";
import { error, response } from "src/utils/ResponseUtils";
import { Repository } from "typeorm";

@Injectable()
export class PermissionsService {
    private logger = new Logger(PermissionsService.name);

    constructor(
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    ) { }

    async getPermissions() {
        try {
            this.logger.debug("getPermissions")
            return response((await this.permissionRepository.find()).map(permission => {
                const { id, name, description } = permission;
                return { id, name, description }
            }), HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async getPermissionById(inputId: UUID) {
        try {
            this.logger.debug("getPermissionById")
            const entity: Permission = await this.permissionRepository.findOneBy({ id: inputId })
            if (!entity) {
                return error("Permission not found", HttpStatus.BAD_REQUEST)
            }
            const { id, name, description } = entity;
            return response({ id, name, description }, HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async createPermission(createPermissionParams: CreatePermissionParams) {
        try {
            this.logger.debug("createPermission")
            const newEntity: Permission = this.permissionRepository.create({ ...createPermissionParams });
            const savedEntity: Permission =
                await this.permissionRepository.save({
                    ...newEntity,
                });
            const { id, name, description } = savedEntity;
            return response({ id, name, description }, HttpStatus.CREATED)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async updatePermission(inputId: UUID, updatePermissionParams: UpdatePermssionParams) {
        try {
            this.logger.debug("updatePermission")
            const entity: Permission = await this.permissionRepository.findOneBy({ id: inputId })
            if (!entity) {
                return error("Permission not found", HttpStatus.BAD_REQUEST)
            }
            const updatedEntity: Permission = await this.permissionRepository.save({
                ...entity,
                ...updatePermissionParams,
            })
            const { id, name, description } = updatedEntity;
            return response({ id, name, description }, HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async deletePermissionById(inputId: UUID) {
        try {
            this.logger.debug("deletePermissionById")
            const entity: Permission = await this.permissionRepository.findOneBy({ id: inputId })
            if (!entity) {
                return error("Permission not found", HttpStatus.BAD_REQUEST)
            }
            await this.permissionRepository.delete(inputId)
            return response("Delete permission successfully!", HttpStatus.OK)
        } catch (e) {
            throw new HttpException(e.detail, HttpStatus.BAD_REQUEST)
        }
    }

}