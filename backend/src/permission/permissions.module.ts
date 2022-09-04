import { forwardRef, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsResolver } from './permissions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [TypeOrmModule.forFeature([User, Permission]), forwardRef(() => UsersModule)],
  providers: [PermissionsResolver, PermissionsService],
  exports: [PermissionsService]
})
export class PermissionsModule {}