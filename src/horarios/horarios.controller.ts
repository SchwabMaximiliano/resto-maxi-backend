import { Controller, Get, Param } from '@nestjs/common'
import { HorariosService } from './horarios.service'
import { Horario } from '../schemas/horario.schema'
import { RESERVA_HORARIOS } from '../../config/config'
import { DisponibilidadesService } from 'src/disponibilidades/disponibilidades.service'

@Controller('/api/horarios')
export class HorariosController {
  constructor(
    private readonly HorariosService: HorariosService,
    private readonly DisponibilidadesService: DisponibilidadesService,
  ) {}

  @Get('/todos/:date/:personas')
  async getHorarios(
    @Param('date') date: Date,
    @Param('personas') personas: number,
  ): Promise<any> {
    /*
    // ejecutar una sola vez para guardar los horarios enla bd
    RESERVA_HORARIOS.map(async (horario) => {
      await this.HorariosService.saveHorario(horario)
    })
    */
    const horarios = await this.HorariosService.findAll()
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
}
