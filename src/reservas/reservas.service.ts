import { Model } from 'mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Reserva, ReservaDocument } from '../schemas/reserva.schema'
import * as dotenv from 'dotenv'
import { Cron, CronExpression } from '@nestjs/schedule'
dotenv.config()
import { EVERY_180_MINUTES_BETWEEN_8PM_AND_11PM } from 'src/config'
import { transporter } from 'src/helper/mailer'
import { UserDocument } from 'src/schemas/user.schema'

@Injectable()
export class ReservasService {
  constructor(
    @InjectModel('Reserva') private reservaModel: Model<ReservaDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<Reserva[]> {
    return await this.reservaModel.find().exec()
  }

  async findReserva(reserva: Reserva): Promise<Reserva[]> {
    return await this.reservaModel
      .find({
        date: reserva.date,
        hora: reserva.hora,
        personas: reserva.personas,
      })
      .exec()
  }

  async findReservaUser(userId: string): Promise<Reserva[]> {
    return await this.reservaModel.find({ userId })
  }

  async saveReserva(reserva: Reserva): Promise<Reserva> {
    const createdReserva = new this.reservaModel(reserva)
    return await createdReserva.save()
  }

  private readonly logger = new Logger(ReservasService.name)

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  async sendReminder() {
    // seteo la fecha actual en 0 hs para hacer la comparacion con la bd
    const date = new Date(new Date().setHours(0, 0, 0, 0))
    date.setDate(date.getDate() + 2)

    const reserva = await this.reservaModel.find({ date })
    console.log(reserva)

    if (reserva) {
      // ver para transformar el id en object id
      // ver si puedo buscar en users desde aca, sino hay que hacerlo en el controller
      const user = await this.userModel.findOne({
        _id: ObjectId(reserva.userId),
      })
      await transporter.sendMail({
        from: `"Resto Maxi 👻" <${process.env.MAILER_USER}>`, // sender address
        to: user.email, // list of receivers
        subject: 'Verifica tu email ✔', // Subject line
        html: `
          <p><b>Hola ${user.name} Clickea el siguiente enlace para validar tu email</b></p>
          <a href="http://localhost:4000/api/user/confirm/${user.emailStateHash}">Verificar Email</a>
        `,
      })
    }
  }
}
