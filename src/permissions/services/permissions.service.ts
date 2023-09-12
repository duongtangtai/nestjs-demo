import { Injectable, HttpException, HttpStatus, Logger} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { Permission } from "src/common/entities/Permission.entity";
import { RequestService } from "src/common/services/Request.service";
import { response } from "src/utils/ResponseUtils";
import { Repository } from "typeorm";

@Injectable()
export class PermissionsService {
    private logger = new Logger(PermissionsService.name);

    constructor(
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
        private requestService: RequestService
    ){}

    async getPermissions() {
        this.logger.debug("getPermissions")
        return response((await this.permissionRepository.find()).map(permission => {
            const { id, name, description } = permission;
            return { id, name, description}
        }), HttpStatus.OK)
    }

    async getPermissionById(inputId: UUID) {
        this.logger.debug("getPermissionById")
        const entity = await this.permissionRepository.findOneBy({id : inputId})
        if (!entity) {
            throw new HttpException("Permission not found", HttpStatus.BAD_REQUEST)
        }
        const { id, name, description } = entity;
        return response({ id, name, description}, HttpStatus.OK)
    }

    async createPermission(createPermissionParams: CreatePermissionParams) {
        this.logger.debug("createPermission")
        const newEntity = this.permissionRepository.create({...createPermissionParams});
        console.log(this.requestService.getUserData())
        const savedEntity = 
            await this.permissionRepository.save({
                ...newEntity,
                createdBy: this.requestService.getUserData().username,
                updatedAt: this.requestService.getUserData().username
            });
        const { id, name, description } = savedEntity;
        return response({ id, name, description }, HttpStatus.CREATED)
    }

    async updatePermission(inputId: UUID, updatePermissionParams: UpdatePermssionParams) {
        this.logger.debug("updatePermission")
        const entity = await this.permissionRepository.findOneBy({id: inputId})
        if (!entity) {
            throw new HttpException("Permission not found", HttpStatus.BAD_REQUEST)
        }
        const updatedEntity = 
            await this.permissionRepository.save({
                ...entity, 
                ...updatePermissionParams,
                updatedAt: this.requestService.getUserData().username
            })
        const { id, name, description } = updatedEntity;
        return response({ id, name, description }, HttpStatus.OK)
    }

    async deletePermissionById(inputId: UUID) {
        this.logger.debug("deletePermissionById")
        const entity = await this.permissionRepository.findOneBy({id: inputId})
        if (!entity) {
            throw new HttpException("Permission not found", HttpStatus.BAD_REQUEST)
        }
        await this.permissionRepository.delete(inputId)
        return response(`Delete permission with id ${inputId} successfully!`, HttpStatus.OK)
    }
    
}