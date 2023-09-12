import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/User.entity';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { AppModule } from 'src/app.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AppModule)],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        UsersService,
    ],
    controllers: [UsersController],
    exports:[]
})
export class UsersModule {}
