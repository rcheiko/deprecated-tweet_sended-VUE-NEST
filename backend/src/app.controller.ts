import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitterApi } from 'twitter-api-v2';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersService: UsersService,
    private appService: AppService,
    private configService: ConfigService,
    private jwtService: JwtService) {}

  @Post('twitter-callback')
  async twitter(@Body() body:any): Promise<any> {

    const info = JSON.parse(body.info)
    const client = new TwitterApi({
      appKey: this.configService.get('API_KEY'),
      appSecret: this.configService.get('API_KEY_SECRET'),
      accessToken: info.oauth_token,
      accessSecret: info.oauth_token_secret,
    });
    const { client: loggedClient, accessToken, accessSecret} =  await client.login(body.oauth_verifier)
    const user = await loggedClient.v2.me();
    const res:any = await this.usersService.findOneId(user.data.id)
    if (res === undefined) {
        const createUser = this.usersRepository.create({
            user_id:user.data.id,
            accessToken: accessToken,
            accessSecret: accessSecret
        })
      await this.usersRepository.save(createUser);
    }
    const payload = {id: user.data.id, username: user.data.username}
    return {
      jwt: this.jwtService.sign(payload)
    }
  }

  @Get('auth')
  async auth() {
    const client = new TwitterApi({
       appKey: this.configService.get('API_KEY'),
       appSecret: this.configService.get('API_KEY_SECRET')
      });
    const authLink = await client.generateAuthLink('http://localhost:8000');
    return(authLink);
  }
}