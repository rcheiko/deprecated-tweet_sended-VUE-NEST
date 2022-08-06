import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Permission {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;
  
  @Column()
  @Field()
  user_id: string;

  @Column()
  @Field(type => Int)
  userId: number;

  @ManyToOne(() => User, user => user.permission, {onDelete: 'CASCADE'})
  @Field(type => User, {nullable: true})
  user?: User;
}
