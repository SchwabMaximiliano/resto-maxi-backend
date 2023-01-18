import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MesaDocument = HydratedDocument<Mesa>

@Schema()
export class Mesa {
  @Prop()
  personas_nro: number
  @Prop()
  personas: string
  @Prop()
  cant_mesas: number
}

export const MesaSchema = SchemaFactory.createForClass(Mesa)
