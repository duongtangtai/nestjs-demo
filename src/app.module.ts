import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './common/entities/User.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { AuthenicationMiddleWare } from './common/middlewares/AuthenicationMiddleWare';
import { RequestService } from './common/services/Request.service';
import { JwtService } from "@nestjs/jwt/dist"
import { PermissionsModule } from './permissions/permissions.module';
import { Permission } from './common/entities/Permission.entity';
import { Role } from './common/entities/Role.entity';
import { RolesModule } from './roles/roles.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER, APP_GUARD} from '@nestjs/core';
import { AuthGuard } from './common/guards/Auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local']
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [User, Permission, Role],
      database: process.env.DB,
      synchronize: true,
      logging: true,
      subscribers: [],
    }),
    UsersModule, AuthModule, PermissionsModule, RolesModule],
  providers:
    [
      JwtService, RequestService,
      {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter
      },
      {
        provide: APP_GUARD,
        useClass: AuthGuard,
        scope: Scope.REQUEST,
      }
    ],
  exports: [JwtService, RequestService, UsersModule, RolesModule, PermissionsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenicationMiddleWare)
      .exclude("/auth/(.*)")
      .forRoutes("*")
  }
}
