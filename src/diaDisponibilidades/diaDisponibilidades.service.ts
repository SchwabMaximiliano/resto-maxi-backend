import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  DiaDisponibilidad,
  DiaDisponibilidadDocument,
} from '../schemas/diaDisponibilidad.schema'
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class DiaDisponibilidadesService {
  constructor(
    @InjectModel('DiaDisponibilidad')
    private diaDisponibilidadModel: Model<DiaDisponibilidadDocument>,
  ) {}

  async findAll(): Promise<DiaDisponibilidad[]> {
    return await this.diaDisponibilidadModel.find().exec()
  }

  async saveDia(
    diaDisponibilidad: DiaDisponibilidad,
  ): Promise<DiaDisponibilidad> {
    const createdDiaDisponibilidad = new this.diaDisponibilidadModel(
      diaDisponibilidad,
    )
    return await createdDiaDisponibilidad.save()
  }

  async findDiasNoDisponibles(personas: number): Promise<Date[]> {
    const noDispoinibles = await this.diaDisponibilidadModel.find({ personas })
    let diasNoDisponibles = []
    noDispoinibles?.map((reserva) => {
      diasNoDisponibles?.push(new Date(reserva.date).getTime())
    })
    return diasNoDisponibles
  }

  async deleteDia(diaDisponibilidad: DiaDisponibilidad): Promise<void> {
    await this.diaDisponibilidadModel.deleteOne(diaDisponibilidad)
  }
}
