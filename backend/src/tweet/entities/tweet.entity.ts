import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Permission } from "src/permission/entities/permission.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Tweet {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Column()
    @Field()
    scheduleTweet: Date

    @Column()
    @Field()
    tweet: string;

    @Column({nullable: true})
    @Field({nullable:true})
    user_id?: string;

    @Column({nullable: true})
    @Field({nullable:true})
    gifLink?: string;

    @ManyToOne(() => User, user => user.tweet, {onDelete: 'CASCADE'})
    @Field(type => User)
    user: User;

    @CreateDateColumn()
    @Field()
    createdDate: Date
}