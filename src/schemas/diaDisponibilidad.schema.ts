import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type DiaDisponibilidadDocument = HydratedDocument<DiaDisponibilidad>

@Schema()
export class DiaDisponibilidad {
  @Prop()
  date: Date
  @Prop()
  personas: number
}

export const DiaDisponibilidadSchema =
  SchemaFactory.createForClass(DiaDisponibilidad)
