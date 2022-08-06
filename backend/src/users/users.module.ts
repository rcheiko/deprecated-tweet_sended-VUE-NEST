import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from 'src/permission/permissions.module';
import { Permission } from '../permission/entities/permission.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { jwtStrategy } from 'src/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule,
    TypeOrmModule.forFeature([User, Permission]),
    forwardRef(() => PermissionsModule),
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '1d'}
    })],
  providers: [UsersService, UsersResolver, jwtStrategy,
    {
      provide: 'usersService',
      useClass: UsersService
    }],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
