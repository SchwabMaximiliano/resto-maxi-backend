import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReservasController } from './reservas.controller'
import { ReservasService } from './reservas.service'
import { Reserva, ReservaSchema } from '../schemas/reserva.schema'
import { DisponibilidadModule } from 'src/disponibilidades/disponibilidades.module'
import { MesaModule } from 'src/mesas/mesas.module'
import { HorarioModule } from 'src/horarios/horarios.module'
import { DiaDisponibilidadModule } from 'src/diaDisponibilidades/diaDisponibilidades.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reserva', schema: ReservaSchema }]),
    DisponibilidadModule,
    MesaModule,
    HorarioModule,
    DiaDisponibilidadModule,
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservaModule {}
