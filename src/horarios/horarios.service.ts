import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Horario, HorarioDocument } from '../schemas/horario.schema'
import { RESERVA_HORARIOS } from '../../config/config'
import { DisponibilidadesService } from 'src/disponibilidades/disponibilidades.service'

@Injectable()
export class HorariosService {
  constructor(
    @InjectModel('Horario') private horarioModel: Model<HorarioDocument>,
    private readonly DisponibilidadesService: DisponibilidadesService,
  ) {}

  async findAll(): Promise<Horario[]> {
    /*
    // ejecutar una sola vez para guardar los horarios enla bd
    RESERVA_HORARIOS.map(async (horario) => {
      await this.saveHorario(horario)
    })
    */
    return await this.horarioModel.find().exec()
  }

  async findHorariosAndDisponibilidades(
    date: Date,
    personas: number,
  ): Promise<Object> {
    const horarios = await this.findAll()
    const horarios_no_disponibles =
      await this.DisponibilidadesService.findHorariosNoDisponibles({
        date,
        personas,
      })

    const horarios_todos = {
      horarios,
      horarios_no_disponibles,
    }
    return horarios_todos
  }

  async saveHorario(horario: Horario): Promise<Horario> {
    const createdHorario = new this.horarioModel(horario)
    return await createdHorario.save()
  }
}
