import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from 'src/users/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/User.entity';
import { RequestService } from 'src/common/services/Request.service';
import { JwtService } from "@nestjs/jwt"
import { AppModule } from 'src/app.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AppModule),
        forwardRef(() => UsersModule)
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
