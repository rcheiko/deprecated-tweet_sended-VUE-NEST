import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/jwt.guard';

@Resolver((of) => User)
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtGuard)
    @Mutation(returns => User)
    createPermission(@Args('user_id_owner', { type: () => String }) user_id_owner: string,
                     @Args('nameUser', { type: () => String }) nameUser: string): Promise<Permission | void>{
      return this.usersService.createPermission(user_id_owner, nameUser);
    }

    @UseGuards(JwtGuard)
    @Mutation(returns => User)
    removePermission(@Args('user_id_owner', { type: () => String }) user_id_owner: string,
                     @Args('user_id', { type: () => String }) user_id: string): Promise<User> {
      return this.usersService.removePermission(user_id_owner, user_id);
    }

    @UseGuards(JwtGuard)
    @Query(returns => User, { name: 'findOneUser' })
    findOne(@Args('id', { type: () => Int }) id: number): Promise<User | void> {
      return this.usersService.findOne(id);
    }

    @UseGuards(JwtGuard)
    @Query(returns => User, { name: 'findOneUserId' })
    findOneId(@Args('user_id', { type: () => String }) user_id: string): Promise<User | void> {
      return this.usersService.findOneId(user_id);
    }

    @UseGuards(JwtGuard)
    @Query(returns => [User], { name: 'FindAllUsers' })
    findAll(): Promise<User[] | void> {
      return this.usersService.findAll();
    }
}