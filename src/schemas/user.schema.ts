import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export class login {
  user: ArrayBufferView;
  password: ArrayBufferView;
}

@Schema()
export class User {
  @Prop()
  name: string;
  @Prop()
  lastName: string;
  @Prop()
  dni: number;
  @Prop()
  gender: string;
  @Prop()
  phone: number;
  @Prop()
  phoneState: string;
  @Prop()
  email: string;
  @Prop()
  emailState: string;
  @Prop()
  emailStateHash: string;
  @Prop()
  user: string;
  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
