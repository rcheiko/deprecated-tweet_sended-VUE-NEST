import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TweetService } from './tweet.service';
import { Tweet } from './entities/tweet.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/jwt.guard';

@Resolver((of) => Tweet)
export class TweetResolver {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(JwtGuard)
  @Mutation(() => Tweet, { name: 'createTweet' })
  createTweet(@Args('tweet', { type: () => String }) tweet: string,
              @Args('scheduleTweet', { type: () => Date }) scheduleTweet: Date,
              @Args('user_id', { type: () => String }) user_id: string,
              @Args('user_id_owner', { nullable:true, type: () => String }) user_id_owner?: string
              ): Promise<Tweet | void> {
    return this.tweetService.create(tweet, scheduleTweet, user_id, user_id_owner);
  }

  @UseGuards(JwtGuard)
  @Mutation(() => Tweet, { name: 'createTweetGif' })
  createTweet_gif(@Args('tweet', { type: () => String }) tweet: string,
              @Args('scheduleTweet', { type: () => Date }) scheduleTweet: Date,
              @Args('user_id', { type: () => String }) user_id: string,
              @Args('gifLink', { type: () => String }) gifLink: string,
              @Args('user_id_owner', { nullable:true, type: () => String }) user_id_owner?: string
              ): Promise<Tweet | void> {
    return this.tweetService.create_gif(tweet, scheduleTweet, user_id, gifLink, user_id_owner);
  }

  @UseGuards(JwtGuard)
  @Mutation(() => Tweet, { name: 'createTweetMedia' })
  createTweet_media(@Args('tweet', { type: () => String }) tweet: string,
              @Args('scheduleTweet', { type: () => Date }) scheduleTweet: Date,
              @Args('user_id', { type: () => String }) user_id: string,
              @Args('mediaLink', { type: () => String }) mediaLink: string[],
              @Args('user_id_owner', { nullable:true, type: () => String }) user_id_owner?: string
              ): Promise<Tweet | void> {
    return this.tweetService.create_media(tweet, scheduleTweet, user_id, mediaLink, user_id_owner);
  }

  @UseGuards(JwtGuard)
  @Mutation(() => Tweet)
  updateTweet(@Args('id', { type: () => Int }) id: number,
              @Args('scheduleTweet', { type: () => Date }) scheduleTweet: Date,
              @Args('tweet', { type: () => String }) tweet: string,
              @Args('gifLink', { nullable:true, type: () => String }) gifLink?,
              @Args('mediaLink', { nullable:true, type: () => Array<String> }) mediaLink?): Promise<Tweet | void> {
    return this.tweetService.updateTweet(id, scheduleTweet, tweet, gifLink, mediaLink);
  }

  @UseGuards(JwtGuard)
  @Mutation(() => [Tweet], { name: 'removeTweet' })
  removeTweet(@Args('id', { type: () => Int }) id: number): Promise< Tweet[] | void> {
    return this.tweetService.removeTweet(id);
  }

  // @UseGuards(JwtGuard)
  @Query(() => [Tweet], { name: 'findAllTweet' })
  findAll(): Promise<Tweet[] | void> {
    return this.tweetService.findAll();
  }

  @UseGuards(JwtGuard)
  @Query(() => [Tweet], { name: 'findTweetUserMatch' })
  findTweetUserMatch(@Args('user_id_owner', { type: () => String }) user_id_owner: string): Promise<Tweet[] | void> {
    return this.tweetService.findTweetUserMatch(user_id_owner);
  }

  @UseGuards(JwtGuard)
  @Query(() => Tweet, { name: 'findOneTweet' })
  findOne(@Args('user_id', { type: () => String }) user_id: string): Promise<Tweet | void> {
    return this.tweetService.findOne(user_id);
  }
}
