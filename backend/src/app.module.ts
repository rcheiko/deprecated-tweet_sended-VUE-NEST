import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from './permission/permissions.module';
import { TweetModule } from './tweet/tweet.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        origin: process.env.FRONT_APP,
        credentials: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // database: ':memory:',
      database: './db.sqlite',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PermissionsModule,
    TweetModule,
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '1d' }
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }