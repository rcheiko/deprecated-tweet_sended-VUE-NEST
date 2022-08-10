import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/jwt.guard';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService) {}

    @UseGuards(JwtGuard)
    @Get('infoUser/:user_id')
    getInfoUser(@Param() params:any): any {
      return this.usersService.getInfoUser(params.user_id);
    }

    @UseGuards(JwtGuard)
    @Get('giveAllUsersPermissions/:user_id')
    giveAllUsersPermissions(@Param() params:any): any {
      return this.usersService.giveAllUsersPermissions(params.user_id);
    }

    @UseGuards(JwtGuard)
    @Get('giveUsersTweet/:user_id')
    giveUsersTweet(@Param() params:any): any {
      return this.usersService.giveUsersTweet(params.user_id);
    }

    @UseGuards(JwtGuard)
    @Post('tweet/:user_id')
    tweet(@Param() params:any, @Body() body:any): any {
      return this.usersService.tweet(body.tweet, params.user_id, body.media);
    }

    @UseGuards(JwtGuard)
    @Post('tweetPermission/:user_id_owner')
    tweetPermission(@Param() params:any, @Body() body:any): any {
      return this.usersService.tweetPermission(body.tweet, params.user_id_owner, body.user_id, body.gif);
    }

    @Post('file')
    // @UseInterceptors(FileInterceptor('file', {
      @UseInterceptors(AnyFilesInterceptor())
        // @UseInterceptors(AnyFilesInterceptor({
        // storage: diskStorage({
        // destination: './file/image',
        // filename: (req, file, callback) => {
          // const filename = Date.now() + file.originalname;          
          // callback(null, filename);
        // }
      // })
    // }))
    async test(@UploadedFiles() files: Array<Express.Multer.File>): Promise<any> {
      console.log('files :', files);
      return 'File has been uploaded';
    }
}
