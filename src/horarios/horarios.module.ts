import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HorariosController } from './horarios.controller'
import { HorariosService } from './horarios.service'
import { Horario, HorarioSchema } from '../schemas/horario.schema'
import { DisponibilidadModule } from 'src/disponibilidades/disponibilidades.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Horario', schema: HorarioSchema }]),
    DisponibilidadModule,
  ],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports: [HorariosService],
})
export class HorarioModule {}
