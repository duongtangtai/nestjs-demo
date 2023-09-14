import { Module, forwardRef } from '@nestjs/common';
import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService } from './services/permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/common/entities/Permission.entity';
import { AppModule } from 'src/app.module';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [TypeOrmModule.forFeature([Permission]), forwardRef(() => AppModule)],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        PermissionsService,
    ],
    controllers: [PermissionsController],
})
export class PermissionsModule {}
