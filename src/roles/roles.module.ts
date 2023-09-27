import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Role } from 'src/common/entities/Role.entity';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/Roles.service';
import { Permission } from 'src/common/entities/Permission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => AppModule)],
    providers: [
        RolesService,
    ],
    controllers: [RolesController],
    exports: [TypeOrmModule, RolesService]
})
export class RolesModule { }
