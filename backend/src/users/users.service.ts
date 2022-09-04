import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EUploadMimeType, TwitterApi } from 'twitter-api-v2';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionsService } from 'src/permission/permissions.service';
import { Permission } from 'src/permission/entities/permission.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User) private usersRepository: Repository<User>,
  @InjectRepository(Permission) private permissionsRepository: Repository<Permission>,
  private readonly configService: ConfigService,
  @Inject(forwardRef(() => PermissionsService))
  private permissionsService: PermissionsService,
  private readonly httpService: HttpService) {}

  async createPermission(user_id_owner: string, nameUser: string): Promise<Permission | void> {
    const twitterClient = new TwitterApi(this.configService.get('BEARER_TOKEN'));
    const roClient = twitterClient.readOnly;
    const infoUser = await roClient.v2.userByUsername(nameUser);
    const user_id = infoUser.data.id.toString();
    const user_owner: any = await this.findOneId(user_id_owner)
    const userCheckAdd: any = await this.findOneId(user_id)
    if (userCheckAdd === undefined) {
      console.log("error user doesn't exist in database")
      return user_owner;
    }
    const checkIfExist = await this.permissionsService.findOneUser(user_id, user_owner.id)
    if (checkIfExist === undefined) {
      const newPermission: any = this.permissionsRepository.create({user_id: user_id});
      const user = await this.findOneId(user_id_owner);
  
      newPermission.user = user // Make the relation OneToMany
  
      const res = await this.permissionsRepository.save(newPermission).catch((err) => {
        console.log("error permission");
        return user_owner;
      })
      return res;  
    }
    console.log("Error permission already exist")
    return user_owner;
  }

  async removePermission(user_id_owner: string, user_id: string): Promise<User> {
    const user: any = await this.findOneId(user_id);
    const user_owner: any = await this.findOneId(user_id_owner);
    const userPerm: any = await this.permissionsService.findOneUser(user.user_id, user_owner.id)
    await this.permissionsRepository.remove(userPerm);

    return user_owner; 
  }

  async findAll(): Promise<User[] | void> {
    const res = await this.usersRepository.find()
    .catch((err) => {
      console.log("Error :", err);
      return ;
    })
    return res;
  }

  async findOne(id: number): Promise<User | void> {
    const res = await this.usersRepository.findOneOrFail({
      where: {
        id: id
      },
      relations: ['permission']
    }).catch((err) => {
      console.log("Error :", err)
      return ;
    })
    return res;
  }

  async findOneId(user_id: string): Promise<User | void> {
    const res = await this.usersRepository.findOneOrFail({
      where: {
        user_id: user_id
      },
      relations: ['permission'],
    }).catch((err) => {
      console.log("Error :", err);
      return ;
    })
    return res;
  }

  async giveAllUsersPermissions(user_id: string): Promise<any> {
    const result = [];
    let user: any;
    await this.findOneId(user_id)
      .then((res) => {
        user = res;
      })
      .catch((err) => {
        console.log("Error", err);
        return ;
      })
    const twitterClient = new TwitterApi(this.configService.get('BEARER_TOKEN'));
    const roClient = twitterClient.readOnly;
    for (let i = 0; user.permission[i]; i++){
      result.push(await roClient.v2.user(user.permission[i].user_id, {'user.fields': ["profile_image_url"]})
      .catch((err) => {
        console.log("Error", err);
        return ;
      }));
    }
    return result;
  }

  async giveUsersTweet(user_id: string): Promise<any> {
    const result = [];
    const user = await this.permissionsService.findMultiplesPermissions(user_id);
    const twitterClient = new TwitterApi(this.configService.get('BEARER_TOKEN'));
    const roClient = twitterClient.readOnly;
    for (let i = 0; user[i]; i++) {
      result.push(await roClient.v2.user(user[i].user.user_id, {'user.fields': []})
      .catch((err) => {
        console.log("Error :", err);
        return ;
      }));
    }
    return result;
  }

  async getInfoUser(user_id: string) {
    const twitterClient = new TwitterApi(this.configService.get('BEARER_TOKEN'));
    const roClient = twitterClient.readOnly;
    const infoUser = await roClient.v1.user({ user_id: user_id });
    return infoUser;
  };

  async tweet(tweet: string, user_id: string, media?: string) {
    const user: any = await this.findOneId(user_id)
      .catch((err) => {
        console.log('error :', err);
        return ;
      });
    const userClient = new TwitterApi({
      appKey: this.configService.get('API_KEY'),
      appSecret: this.configService.get('API_KEY_SECRET'),
      accessToken: user.accessToken,
      accessSecret: user.accessSecret,
    });
    if (media === undefined) {
      await userClient.v2.tweet(tweet);
    }
    else {
      const gifDL:any = await this.downloadFile(media);
      const gifData:any = await lastValueFrom(gifDL);
      const buffer:any = Buffer.from(gifData.data, "utf-8");
      const mediaId = await userClient.v1.uploadMedia(buffer, { mimeType: EUploadMimeType.Gif })
      await userClient.v2.tweet(tweet, { media: {media_ids: [mediaId]} });
    }
  };

  async downloadFile(url:any) {
    return this.httpService.get(url, {
        responseType: 'arraybuffer'
      })
  }

  async tweetPermission(tweet: string, user_id_owner: string, user_id: string, gif?: string) {
    const userId: any = await this.findOneId(user_id);
    const permission: any = await this.permissionsService.findOneUser(user_id_owner, userId.id)
        .catch((err) => {
          console.log("error :", err);
          return ;
        })
    const user: any = await this.findOneId(user_id);
    const userClient = new TwitterApi({
      appKey: this.configService.get('API_KEY'),
      appSecret: this.configService.get('API_KEY_SECRET'),
      accessToken: user.accessToken,
      accessSecret: user.accessSecret,
    });

    if (gif === undefined){
      await userClient.v2.tweet(tweet);
    }
    else{
      const gifDL:any = await this.downloadFile(gif);
      const gifData:any = await lastValueFrom(gifDL);
      const buffer:any = Buffer.from(gifData.data, "utf-8")
      const mediaId = await userClient.v1.uploadMedia(buffer, { mimeType: EUploadMimeType.Gif })
      await userClient.v2.tweet(tweet, { media: {media_ids: [mediaId]} });
    }
  };
}