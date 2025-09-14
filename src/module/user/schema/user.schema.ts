
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string

  @Prop()
  phone : string

  @Prop({default:null})
  image: string

  @Prop({default:"local"})
  account_type: string

  @Prop({default: "users"})
  role: string 

  @Prop({default:false})
  is_active: boolean

  @Prop({default:null})
  code_id: string

  @Prop({default:null})
  code_expired: string
}

export const UserSchema = SchemaFactory.createForClass(User);
