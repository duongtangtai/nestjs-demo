import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Role } from 'src/common/entities/Role.entity';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/Roles.service';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => AppModule)],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        RolesService,
    ],
    controllers: [RolesController],
})
export class RolesModule {}
