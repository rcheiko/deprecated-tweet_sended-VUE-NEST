import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetResolver } from './tweet.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { TweetController } from './tweet.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { Permission } from 'src/permission/entities/permission.entity';
import { PermissionsModule } from 'src/permission/permissions.module';
import { HttpModule } from '@nestjs/axios';
import { jwtStrategy } from 'src/jwt.strategy';

@Module({
  imports: [
              TypeOrmModule.forFeature([Tweet, User, Permission]),
              PermissionsModule,
              HttpModule,
              UsersModule,
              ScheduleModule.forRoot(),
            ],
  providers: [TweetResolver, TweetService, jwtStrategy,
    {
      provide: 'usersService',
      useClass: UsersService
    }],
  controllers: [TweetController],
})
export class TweetModule {}