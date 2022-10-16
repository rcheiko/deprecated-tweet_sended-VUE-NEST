import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Tweet } from './entities/tweet.entity';
import { TwitterApi } from 'twitter-api-v2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  private usersService: UsersService,
  private readonly configService: ConfigService) {}


  @Cron('00 * * * * *')
  async handleCron() {
    const allTweet:any = await this.findAll()
        .catch((err) => {
          console.log('error :', err);
          return ;
        })
    for (let i = 0; allTweet[i]; i++) {
      if (allTweet[i].scheduleTweet.getTime() - Date.now() <= 0)
      {
        if (allTweet[i].mediaLink) {
          
        }
        else if (allTweet[i].gifLink) {
          await this.usersService.tweet(allTweet[i].tweet, allTweet[i].user.user_id, allTweet[i].gifLink)
          await this.removeTweet(allTweet[i].id)
        }
        else {
          await this.usersService.tweet(allTweet[i].tweet, allTweet[i].user.user_id)
          await this.removeTweet(allTweet[i].id)
        }
      }
    }
  }


  async create(tweet: string, scheduleTweet: Date, user_id: string, user_id_owner?:string): Promise<Tweet | void>
  {
    const user:any = await this.usersService.findOneId(user_id)
        .catch((err) => {
          console.log("error :", err);
        });
    let _tweet: Tweet;
    if (user_id_owner != undefined) {
      _tweet = this.tweetRepository.create({
        tweet: tweet,
        scheduleTweet:scheduleTweet,
        user_id:user_id_owner,
        user: user
      })
    }
    else {
      _tweet = this.tweetRepository.create({
        tweet: tweet,
        scheduleTweet:scheduleTweet,
        user: user
      })
    }
    const tweet_created = await this.tweetRepository.save(_tweet)
        .catch((err) => {
          console.log("error :", err)
          return ;
        });

    return tweet_created;
  }

  async create_gif(tweet: string, scheduleTweet: Date, user_id: string, gifLink: string, user_id_owner?:string): Promise<Tweet | void>
  {
    const user:any = await this.usersService.findOneId(user_id)
        .catch((err) => {
          console.log("error :", err);
        });
    let _tweet: Tweet;
    if (user_id_owner != undefined) {
      _tweet = this.tweetRepository.create({
        tweet: tweet,
        scheduleTweet:scheduleTweet,
        user_id:user_id_owner,
        gifLink: gifLink,
        user: user
      })
    }
    else {
      _tweet = this.tweetRepository.create({
        tweet: tweet,
        scheduleTweet:scheduleTweet,
        gifLink: gifLink,
        user: user
      })
    }
    const tweet_created = await this.tweetRepository.save(_tweet)
        .catch((err) => {
          console.log("error :", err)
          return ;
        });
    return tweet_created;
  }


  async create_media(tweet: string, scheduleTweet: Date, user_id: string, mediaLink: string[], user_id_owner?:string): Promise<Tweet | void>
  {
    const user:any = await this.usersService.findOneId(user_id)
        .catch((err) => {
          console.log("error :", err);
        });
    let _tweet: Tweet;
    if (user_id_owner != undefined) {
      _tweet = this.tweetRepository.create({
        tweet: tweet,
        scheduleTweet:scheduleTweet,
        user_id:user_id_owner,
        mediaLink: mediaLink,
        user: user
      })
    }
    else {
      _tweet = this.tweetRepository.create({
        tweet: tweet,
        scheduleTweet:scheduleTweet,
        mediaLink: mediaLink,
        user: user
      })
    }
    const tweet_created = await this.tweetRepository.save(_tweet)
        .catch((err) => {
          console.log("error :", err)
          return ;
        });
    return tweet_created;
  }

  async findTweetUserMatch(user_id_owner: string): Promise<Tweet[] | void>
  {
    const res = await this.tweetRepository.find({
        where: {
          user_id: user_id_owner,
        },
        relations: ['user']
    })
        .catch((err) => {
          console.log("error :", err);
          return ;
        })
    return res;
  }

  async findTweetScheduleMe(user_id_owner: string): Promise<Tweet[] | void>
  {
    const user:any = await this.usersService.findOneId(user_id_owner)
      .catch((err) => {
        console.log('error', err);
      })
    if (user === undefined){
      return ;
    }
    const res = await this.tweetRepository.find({
        where: {
          user: user
        },
        relations: ['user']
    })
        .catch((err) => {
          console.log("error :", err);
          return ;
        })
    return res;
  }

  async InfoTweetSchedule(user_id_owner: string)
  {
    let result = [];
    const tweet = await this.findTweetUserMatch(user_id_owner);
    const twitterClient = new TwitterApi(this.configService.get('BEARER_TOKEN'));
    const roClient = twitterClient.readOnly;

    for (let i = 0; tweet[i]; i++) {
      const res = await roClient.v2.user(tweet[i].user.user_id, {'user.fields': ["profile_image_url"]});
      tweet[i].profile_image_url = res.data.profile_image_url;
      tweet[i].username = res.data.username;
    }
    return tweet;
  }

  async InfoTweetScheduleForMe(user_id_owner: string)
  {
    const my_tweet = await this.findTweetScheduleMe(user_id_owner);
    return my_tweet;
  }


  async findAll(): Promise<Tweet[] | void>
  {
    const res = await this.tweetRepository.find({
      relations: ['user']
    })
      .catch((err) => {
        console.log("error :", err);
        
        return ;
      })
    return res;
  }

  async findOne(user_id: string): Promise<Tweet | void>
  {
    const res = await this.tweetRepository.findOneOrFail({
      where: {
        user_id: user_id
      },
      relations: ['user'],
    }).catch((err) => {
      console.log("Error :", err);
      return ;
    })
    return res;
  }

  async findOneId(id: number): Promise<Tweet | void>
  {
    const res = await this.tweetRepository.findOneOrFail({
      where: {
        id: id
      },
      relations: ['user'],
    }).catch((err) => {
      console.log("Error :", err);
      return ;
    })
    return res;
  }

  async updateTweet(id: number, scheduleTweet: Date, tweet: string, gifLink?: string, mediaLink?: string[]): Promise<Tweet | void> {
    if (mediaLink) {
      await this.tweetRepository.update(id, {scheduleTweet: scheduleTweet, tweet: tweet, mediaLink: mediaLink})
        .catch((err) => {
          console.log('error :', err);
          return ;
        })
    }
    else if (gifLink) {
      await this.tweetRepository.update(id, {scheduleTweet: scheduleTweet, tweet: tweet, gifLink: gifLink})
        .catch((err) => {
          console.log('error :', err);
          return ;
        })
    }
    else {
      await this.tweetRepository.update(id, {scheduleTweet: scheduleTweet, tweet: tweet})
        .catch((err) => {
          console.log('error :', err);
          return ;
        })
    }
    const res = await this.findOneId(id)
      .catch((err) => {
        console.log('error  :', err);
        return ;
      })
    return res;
  }

  async removeTweet(id: number): Promise<Tweet[] | void> {
    const res = await this.findAll();
    const tweet:any = await this.findOneId(id)
      .catch((err) => {
        console.log('error :', err);
        return ;
      });
      await this.tweetRepository.remove(tweet)
      .catch((err) => {
        console.log('error :', err);
      })
    return res;
  }
}
