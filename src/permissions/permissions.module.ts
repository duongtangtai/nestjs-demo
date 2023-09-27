import { Module, forwardRef } from '@nestjs/common';
import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService } from './services/permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/common/entities/Permission.entity';
import { AppModule } from 'src/app.module';

@Module({
    imports: [TypeOrmModule.forFeature([Permission]), forwardRef(() => AppModule)],
    providers: [
        PermissionsService,
    ],
    controllers: [PermissionsController],
    exports: [TypeOrmModule, PermissionsService]
})
export class PermissionsModule { }
