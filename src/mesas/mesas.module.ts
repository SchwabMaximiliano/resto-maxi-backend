import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MesasController } from './mesas.controller'
import { MesasService } from './mesas.service'
import { Mesa, MesaSchema } from '../schemas/mesa.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Mesa', schema: MesaSchema }])],
  controllers: [MesasController],
  providers: [MesasService],
  exports: [MesasService],
})
export class MesaModule {}
