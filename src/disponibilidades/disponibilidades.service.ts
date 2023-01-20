import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  Disponibilidad,
  DisponibilidadDocument,
} from '../schemas/disponibilidad.schema'
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class DisponibilidadesService {
  constructor(
    @InjectModel('Disponibilidad')
    private disponibilidadModel: Model<DisponibilidadDocument>,
  ) {}

  async findAll(): Promise<Disponibilidad[]> {
    return await this.disponibilidadModel.find().exec()
  }

  async saveDisponibilidad(
    disponibilidad: Disponibilidad,
  ): Promise<Disponibilidad> {
    const createdDisponibilidad = new this.disponibilidadModel(disponibilidad)
    return await createdDisponibilidad.save()
  }

  async deleteDisponibilidad(disponibilidad: Disponibilidad): Promise<void> {
    const borrado = await this.disponibilidadModel.deleteOne(disponibilidad)
    console.log(borrado)
  }

  async findHorariosNoDisponibles(reserva: any): Promise<string[]> {
    let horasNoDisponibles = []

    const noDisponibles = await this.disponibilidadModel.find({
      date: reserva.date,
      personas: reserva.personas,
    })

    noDisponibles?.map((reserva) => {
      horasNoDisponibles.push(reserva.hora)
    })

    return horasNoDisponibles
  }
}
