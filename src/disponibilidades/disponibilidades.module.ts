import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DisponibilidadesController } from './disponibilidades.controller'
import { DisponibilidadesService } from './disponibilidades.service'
import {
  Disponibilidad,
  DisponibilidadSchema,
} from '../schemas/disponibilidad.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Disponibilidad', schema: DisponibilidadSchema },
    ]),
  ],
  controllers: [DisponibilidadesController],
  providers: [DisponibilidadesService],
  exports: [DisponibilidadesService],
})
export class DisponibilidadModule {}
