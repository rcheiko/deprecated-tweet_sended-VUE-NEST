import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/jwt.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { saveImageStore } from './validtypes.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService) { }

  @UseGuards(JwtGuard)
  @Get('infoUser/:user_id')
  getInfoUser(@Param() params: any): any {
    return this.usersService.getInfoUser(params.user_id);
  }

  @UseGuards(JwtGuard)
  @Get('giveAllUsersPermissions/:user_id')
  giveAllUsersPermissions(@Param() params: any): any {
    return this.usersService.giveAllUsersPermissions(params.user_id);
  }

  @UseGuards(JwtGuard)
  @Get('giveUsersTweet/:user_id')
  giveUsersTweet(@Param() params: any): any {
    return this.usersService.giveUsersTweet(params.user_id);
  }

  @UseGuards(JwtGuard) // tweet for user account
  @Post('tweet/:user_id')
  tweet(@Param() params: any, @Body() body: any): any {
    return this.usersService.tweet(body.tweet, params.user_id, body.media);
  }

  @UseGuards(JwtGuard) // tweet for someone
  @Post('tweetPermission/:user_id_owner')
  tweetPermission(@Param() params: any, @Body() body: any): any {
    return this.usersService.tweetPermission(body.tweet, params.user_id_owner, body.user_id, body.gif);
  }

  @UseGuards(JwtGuard)
  @Post('file/:user_id')
  @UseInterceptors(AnyFilesInterceptor(saveImageStore))
  async tweetWithFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any, @Param() params: any) {
    if (!files[0]?.filename) {
      console.log('File must be a png/jpg/jpeg/gif/mp4');
      return ;
    }
    this.usersService.tweetWithFiles(body.tweet, params.user_id_owner, body.user_id, files)
    return 'File has been uploaded';
  }
}