import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './users/users.module'
import { ReservaModule } from './reservas/reservas.module'
import { MesaModule } from './mesas/mesas.module'
import { HorarioModule } from './horarios/horarios.module'
import { DisponibilidadModule } from './disponibilidades/disponibilidades.module'
import * as dotenv from 'dotenv'
dotenv.config()

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI),
    ReservaModule,
    UserModule,
    MesaModule,
    HorarioModule,
    DisponibilidadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
