import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type HorarioDocument = HydratedDocument<Horario>

@Schema()
export class Horario {
  @Prop()
  nombre: string
}

export const HorarioSchema = SchemaFactory.createForClass(Horario)
