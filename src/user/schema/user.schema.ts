
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  _id: string

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string

  @Prop()
  phone : number

  @Prop()
  image: string

  @Prop()
  account_type: string

  @Prop()
  role: number

  @Prop()
  is_active: boolean

  @Prop()
  code_id: string

  @Prop()
  code_expired: string
}

export const UserSchema = SchemaFactory.createForClass(User);
