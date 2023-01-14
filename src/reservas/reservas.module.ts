import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReservasController } from './reservas.controller'
import { ReservasService } from './reservas.service'
import { Reserva, ReservaSchema } from '../schemas/reserva.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reserva', schema: ReservaSchema }]),
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservaModule {}
