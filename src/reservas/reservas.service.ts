import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Reserva, ReservaDocument } from '../schemas/reserva.schema'
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class ReservasService {
  constructor(
    @InjectModel('Reserva') private reservaModel: Model<ReservaDocument>,
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
    return await this.reservaModel.find({ userId: userId })
  }

  async saveReserva(reserva: Reserva): Promise<Reserva> {
    const createdReserva = new this.reservaModel(reserva)
    return await createdReserva.save()
  }
}
