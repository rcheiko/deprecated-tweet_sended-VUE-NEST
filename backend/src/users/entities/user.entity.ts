import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Permission } from "src/permission/entities/permission.entity";
import { Tweet } from "src/tweet/entities/tweet.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;
    
    @Column({unique: true})
    @Field()
    user_id: string;

    @Column()
    @Field()
    accessToken: string;

    @Column()
    @Field()
    accessSecret: string;

    @OneToMany(() => Permission, permission => permission.user)
    @Field(type => [Permission], {nullable: true})
    permission?: Permission[];

    @OneToMany(() => Tweet, tweet => tweet.user)
    tweet?: Tweet[];
}