import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { User } from './user.schema'

export type ReservaDocument = HydratedDocument<Reserva>

@Schema()
export class Reserva {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User
  @Prop()
  personas: number
  @Prop()
  dia: string
  @Prop()
  hora: string
  @Prop()
  date: Date
  @Prop()
  active: boolean
}

export const ReservaSchema = SchemaFactory.createForClass(Reserva)
