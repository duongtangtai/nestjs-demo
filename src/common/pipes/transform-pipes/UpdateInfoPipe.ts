import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { BaseEntity } from 'src/common/entities/Base.entity';
import { RequestService } from 'src/common/services/Request.service';

@Injectable()
export class UpdateInfoPipe implements PipeTransform {

    constructor(private requestService: RequestService) {
    }

    transform(entity: BaseEntity, metadata: ArgumentMetadata) {
        console.log("UpdateInfoPipe=>>>>>>>>>>>>>>>>>>>>>>>")
        if (entity) {
            entity.updated_by = this.requestService.getUserData().username
        }
        return entity;
    }
}