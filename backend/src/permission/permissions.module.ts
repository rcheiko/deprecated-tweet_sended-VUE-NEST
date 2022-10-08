import { forwardRef, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsResolver } from './permissions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Permission]),
    forwardRef(() => UsersModule),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),],
  providers: [PermissionsResolver, PermissionsService],
  exports: [PermissionsService]
})
export class PermissionsModule { }