import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/jwt.guard';
import { TweetService } from './tweet.service';

@Controller('tweet')
export class TweetController {
    constructor(
        private tweetService: TweetService) {}

    @UseGuards(JwtGuard)
    @Get('schedule_for_me/:user_id_owner')
    giveTweetScheduleForMe(@Param() params:any): any {
      return this.tweetService.InfoTweetScheduleForMe(params.user_id_owner);
    }

    // @UseGuards(JwtGuard)
    @Get('schedule/:user_id_owner')
    giveTweetSchedule(@Param() params:any): any {
      return this.tweetService.InfoTweetSchedule(params.user_id_owner);
    }
}