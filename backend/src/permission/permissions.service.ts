import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
// import { CreatePermissionInput } from './dto/create-permission.input';
// import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private permissionsRepository: Repository<Permission>,
                                            @Inject(forwardRef(() => UsersService))
                                            private usersService: UsersService) {}

  findAll(): Promise<Permission[] | void> {
    const permission = this.permissionsRepository.find()
    .catch((err) => {
      console.log("ERROR :", err);
      return ;
    })
    return permission
  }

  findOne(id: number): Promise<Permission | void> {
    const permission = this.permissionsRepository.findOneOrFail({
      where: {
        id: id,
      },
      relations: ['user']
    })
    .catch((err) => {
    })
    return permission;
  }

  findOneId(user_id: string): Promise<Permission> {
    const permission = this.permissionsRepository.findOneOrFail({
      where: {
        user_id: user_id,
      },
      relations: ['user']
    })
    permission.catch((err) => {
      console.log("ERROR :", err);
      return ;
    })
    return permission;
  }

  findOneUser(user_id:string, userId: number): Promise<Permission | void> {
    const permission = this.permissionsRepository.findOneOrFail({
      where: {
        user_id:user_id,
        userId: userId,
      },
      relations: ['user']
    })
    .catch((err) => {
      console.log("Error permission doesn't exist")
      return ;
    })
    return permission;
  }

  async findMultiplesPermissions(user_id:string): Promise<Permission[] | void> {
    const permission = await this.permissionsRepository.find({
      where: {
        user_id: user_id,
      },
      relations: ['user']
    })
      .catch((err) => {
        console.log("Error :", err);
        return ;
      })
    return permission;
  }

  getUser(userId: string): Promise<User | void> {
    const user = this.usersService.findOneId(userId)
      .catch((err) => {
        console.log("Error :", err);
        return ;
      })
    return user;
  }
}
