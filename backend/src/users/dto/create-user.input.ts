import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumberString, IsOptional } from "class-validator"

@InputType()
export class CreateUserInput {
    @Field()
    user_id: string;

    @IsOptional()
    @IsNumberString()
    @Field({nullable:true})
    refresh_token?: string;
}