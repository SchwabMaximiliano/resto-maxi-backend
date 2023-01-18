import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ReservaDocument = HydratedDocument<Reserva>

@Schema()
export class Reserva {
  @Prop()
  userId: string
  @Prop()
  personas: number
  @Prop()
  dia: string
  @Prop()
  hora: string
  @Prop()
  date: Date
}

export const ReservaSchema = SchemaFactory.createForClass(Reserva)
