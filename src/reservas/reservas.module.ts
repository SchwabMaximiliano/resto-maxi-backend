import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReservasController } from './reservas.controller'
import { ReservasService } from './reservas.service'
import { Reserva, ReservaSchema } from '../schemas/reserva.schema'
import { DisponibilidadModule } from 'src/disponibilidades/disponibilidades.module'
import { MesaModule } from 'src/mesas/mesas.module'
import { HorarioModule } from 'src/horarios/horarios.module'
import { DiaDisponibilidadModule } from 'src/diaDisponibilidades/diaDisponibilidades.module'
import { ScheduleModule } from '@nestjs/schedule'
import { UserModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reserva', schema: ReservaSchema }]),
    ScheduleModule.forRoot(),
    DisponibilidadModule,
    MesaModule,
    HorarioModule,
    DiaDisponibilidadModule,
    UserModule,
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservaModule {}
