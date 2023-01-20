import { Model, ObjectId } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Reserva, ReservaDocument } from '../schemas/reserva.schema'
import * as dotenv from 'dotenv'
import { Cron, CronExpression } from '@nestjs/schedule'
dotenv.config()
import {
  EMAIL_REMINDER,
  EVERY_90_MINUTES_BETWEEN_8PM_AND_11PM,
} from 'src/config'
import { transporter } from 'src/helper/mailer'
import { DisponibilidadesService } from '../disponibilidades/disponibilidades.service'
import { MesasService } from '../mesas/mesas.service'
import { HorariosService } from 'src/horarios/horarios.service'
import { DiaDisponibilidadesService } from 'src/diaDisponibilidades/diaDisponibilidades.service'

@Injectable()
export class ReservasService {
  constructor(
    @InjectModel('Reserva') private reservaModel: Model<ReservaDocument>,
    private readonly DisponibilidadesService: DisponibilidadesService,
    private readonly MesasService: MesasService,
    private readonly HorariosService: HorariosService,
    private readonly DiaDisponibilidadService: DiaDisponibilidadesService,
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

  async findReservasUser(user: ObjectId): Promise<Object> {
    const reservas = {
      vigentes: await this.reservaModel.find({ userId: user, active: true }),
      historicas: await this.reservaModel.find({ userId: user, active: false }),
    }
    return reservas
  }

  async findByDateAndHour(date: Date, hora: string): Promise<Reserva[]> {
    return await this.reservaModel.find({ date, hora }).exec()
  }

  async saveReserva(reserva: Reserva): Promise<Reserva> {
    //guardo la reserva
    const createdReserva = new this.reservaModel(reserva)
    const success = await createdReserva.save()
    // actualizamos disponibilidad de horarios
    if (reserva.active === true) {
      const cantidad_mesas = await this.MesasService.cantidadMesas(
        reserva.personas,
      )
      const reservas_guardadas_mesa = await (
        await this.findReserva(reserva)
      )?.length

      if (
        reservas_guardadas_mesa &&
        reservas_guardadas_mesa >= cantidad_mesas
      ) {
        await this.DisponibilidadesService.saveDisponibilidad({
          date: reserva.date,
          hora: reserva.hora,
          personas: reserva.personas,
        })
      }
      // actualizamos disponibilidad de dias
      const cantidad_horarios = (await this.HorariosService.findAll()).length
      const horarios_no_disponibles = (
        await this.DisponibilidadesService.findHorariosNoDisponibles(reserva)
      )?.length

      if (
        horarios_no_disponibles &&
        horarios_no_disponibles >= cantidad_horarios
      ) {
        await this.DiaDisponibilidadService.saveDia({
          date: reserva.date,
          personas: reserva.personas,
        })
      }
    }
    return success
  }

  // verifico las reservas que dejan de estar vigentes
  // @Cron(CronExpression.EVERY_5_SECONDS)
  @Cron(EVERY_90_MINUTES_BETWEEN_8PM_AND_11PM)
  async updateActive() {
    /*
    //para testear sobre algun dia en particular
    const addDays = (date, days) => {
      date.setDate(date.getDate() + days)
      return date
    }
    const actualDate = addDays(new Date(), 1)
    */

    // seteamos la hora actual
    const actualDate = new Date()
    let hora = ''
    actualDate.getHours() === 20
      ? (hora = '20:00')
      : actualDate.getHours() === 21
      ? (hora = '21:30')
      : (hora = '23:00')

    // buscamos las reservas del dia y la fecha
    actualDate.setHours(0, 0, 0, 0)
    const reservas = await this.findByDateAndHour(actualDate, hora)
    // actualizamos el estado de las reservas
    reservas?.map(async (reserva) => {
      reserva.active = false
      await this.saveReserva(reserva)
      await this.DisponibilidadesService.deleteDisponibilidad({
        date: reserva.date,
        hora: reserva.hora,
        personas: reserva.personas,
      })
      await this.DiaDisponibilidadService.deleteDia({
        date: reserva.date,
        personas: reserva.personas,
      })
    })
  }

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  async sendReminder() {
    // seteo la fecha actual en 0 hs y le sumamos 2 dias
    const date = new Date(new Date().setHours(0, 0, 0, 0))
    date.setDate(date.getDate() + 2)
    // buscamos las reservas de esa fecha y obtenemos los datos del usuario
    const reservas = await this.reservaModel.find({ date }).populate('userId')
    // enviamos los mails de recordatorio a los respectivos usuarios
    reservas?.map(async (reserva) => {
      await transporter.sendMail({
        from: `"Resto Maxi 👻" <${process.env.MAILER_USER}>`, // sender address
        to: reserva.userId.email, // list of receivers
        subject: 'Recordatorio de reserva', // Subject line
        html: EMAIL_REMINDER.replace('{name}', reserva.userId.name)
          .replace('{dia}', reserva.dia)
          .replace('{hora}', reserva.hora)
          .replace('{personas}', reserva.personas.toString()),
      })
    })
  }
}
