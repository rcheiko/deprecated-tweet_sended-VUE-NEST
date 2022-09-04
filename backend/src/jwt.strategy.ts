import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from './users/users.service';
import { Inject, UnauthorizedException } from '@nestjs/common';

export class jwtStrategy extends PassportStrategy(Strategy){
    constructor(@Inject('usersService')
                private usersService: UsersService)
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_JWT
        })
    }

    async validate(payload: any) {
        const user = await this.usersService.findOneId(payload.id);
        if (user === undefined) {
            throw new UnauthorizedException;
        }
        return ({
            id: payload.id,
            username: payload.username
        })
    }
}