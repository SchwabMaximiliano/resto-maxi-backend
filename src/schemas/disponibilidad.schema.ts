import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type DisponibilidadDocument = HydratedDocument<Disponibilidad>

@Schema()
export class Disponibilidad {
  @Prop()
  date: Date
  @Prop()
  hora: string
  @Prop()
  personas: number
}

export const DisponibilidadSchema = SchemaFactory.createForClass(Disponibilidad)
