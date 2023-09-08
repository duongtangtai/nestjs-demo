import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './common/entities/User.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { AuthenicationMiddleWare } from './common/middlewares/AuthenicationMiddleWare';
import { RequestService } from './common/services/Request.service';
import { JwtService } from "@nestjs/jwt/dist"
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    entities: [User],
    database: 'postgres',
    synchronize: true,
    logging: true,
  }), ConfigModule.forRoot({
    envFilePath: ['.env.local']
  }),
    UsersModule, AuthModule, PermissionsModule],
  controllers: [],
  providers: [JwtService, RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenicationMiddleWare)
    .forRoutes({
      path: "/users",
      method: RequestMethod.ALL,
    })
  }
}
