import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePermissionInput {
  @Field()
  user_id: string;
}
