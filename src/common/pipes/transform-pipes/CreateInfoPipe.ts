import { PipeTransform, Injectable, ArgumentMetadata, Scope } from '@nestjs/common';
import { BaseEntity } from 'src/common/entities/Base.entity';
import { RequestService } from 'src/common/services/Request.service';

@Injectable()
export class CreateInfoPipe implements PipeTransform {
    constructor(private requestService: RequestService) {
    }

    transform(entity: BaseEntity, metadata: ArgumentMetadata) {
        if (entity) {
            entity.created_by = this.requestService.getUserData().username
            entity.updated_by = this.requestService.getUserData().username
        }
        return entity;
    }
}