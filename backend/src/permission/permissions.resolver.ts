import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
// import { CreatePermissionInput } from './dto/create-permission.input';
// import { UpdatePermissionInput } from './dto/update-permission.input';

@Resolver((of) => Permission)
export class PermissionsResolver {
  constructor(private permissionsService: PermissionsService) {}

  // @Mutation(() => Permission)
  // createPermission(@Args('createPermissionInput') createPermissionInput: CreatePermissionInput) {
  //   return this.permissionsService.create(createPermissionInput);
  // }

  @Query((returns) => [Permission], { name: 'findAllPermissions' })
  findAll(): Promise<Permission[] | void> {
    return this.permissionsService.findAll();
  }

  @Query((returns) => Permission, { name: 'findOnePermission' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Permission | void> {
    return this.permissionsService.findOne(id);
  }

  @Query((returns) => Permission, { name: 'findOnePermissionId' })
  findOneId(@Args('user_id', { type: () => String }) user_id: string) {
    return this.permissionsService.findOneId(user_id);
  }

  @Query((returns) => [Permission], { name: 'findMultiplesPermissions' })
  findMultiplesPermissions(@Args('user_id', { type: () => String }) user_id: string): Promise<Permission[] | void> {
    return this.permissionsService.findMultiplesPermissions(user_id);
  }

  @Query((returns) => Permission, { name: 'findOnePermissionUser' })
  findOneUser(@Args('user_id', { type: () => String }) user_id: string,
              @Args('userId', { type: () => Number }) userId: number): Promise<Permission | void> {
    return this.permissionsService.findOneUser(user_id, userId);
  }

  @ResolveField((returns) => User)
  User(@Parent() permission:Permission): Promise<User | void> {
    return this.permissionsService.getUser(permission.userId.toString())
  }

  // @Mutation(() => Permission)
  // updatePermission(@Args('updatePermissionInput') updatePermissionInput: UpdatePermissionInput) {
  //   return this.permissionsService.update(updatePermissionInput.id, updatePermissionInput);
  // }

  // @Mutation(() => Permission)
  // removePermission(@Args('id', { type: () => Int }) id: number) {
  //   return this.permissionsService.remove(id);
  // }
}
