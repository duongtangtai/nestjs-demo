import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/User.entity';
import { AppModule } from 'src/app.module';
import { Role } from 'src/common/entities/Role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AppModule)],
    providers: [
        UsersService
    ],
    controllers: [UsersController],
    exports: [TypeOrmModule]
})
export class UsersModule { }
