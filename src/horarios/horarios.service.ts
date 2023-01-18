import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Horario, HorarioDocument } from '../schemas/horario.schema'

@Injectable()
export class HorariosService {
  constructor(
    @InjectModel('Horario') private horarioModel: Model<HorarioDocument>,
  ) {}

  async findAll(): Promise<Horario[]> {
    return await this.horarioModel.find().exec()
  }

  async saveHorario(horario: Horario): Promise<Horario> {
    const createdHorario = new this.horarioModel(horario)
    return await createdHorario.save()
  }
}
