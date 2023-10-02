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
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/Auth.guard';
import { ClientsModule } from '@nestjs/microservices';
import { MAIL_MICROSERVICES, MAIL_MICROSERVICES_GROUP_ID } from './utils/constants';
import { Transport } from '@nestjs/microservices/enums';
import { GatewayModule } from './gateway/gateway.module';

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
    ClientsModule.register([
      {
        name: MAIL_MICROSERVICES,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "user",
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: MAIL_MICROSERVICES_GROUP_ID
          },
        },
      }
    ]),
    UsersModule, AuthModule, PermissionsModule, RolesModule, GatewayModule],
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
  exports: [ClientsModule, JwtService, RequestService, UsersModule, RolesModule, PermissionsModule, GatewayModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenicationMiddleWare)
      .exclude("/auth/(.*)")
      .forRoutes("*")
  }
}
