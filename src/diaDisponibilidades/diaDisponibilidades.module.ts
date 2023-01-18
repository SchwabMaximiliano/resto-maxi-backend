import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DiaDisponibilidadesController } from './diaDisponibilidades.controller'
import { DiaDisponibilidadesService } from './diaDisponibilidades.service'
import {
  DiaDisponibilidad,
  DiaDisponibilidadSchema,
} from '../schemas/diaDisponibilidad.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DiaDisponibilidad', schema: DiaDisponibilidadSchema },
    ]),
  ],
  controllers: [DiaDisponibilidadesController],
  providers: [DiaDisponibilidadesService],
  exports: [DiaDisponibilidadesService],
})
export class DiaDisponibilidadModule {}
