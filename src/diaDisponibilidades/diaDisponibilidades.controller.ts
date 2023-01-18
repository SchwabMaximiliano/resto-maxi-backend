import { Controller, Get, Param } from '@nestjs/common'
import { Response } from 'express'
import { DiaDisponibilidadesService } from './diaDisponibilidades.service'
import { DiaDisponibilidad } from '../schemas/diaDisponibilidad.schema'

@Controller('/api/dia-disponibilidades')
export class DiaDisponibilidadesController {
  constructor(
    private readonly DiasDisponiblesService: DiaDisponibilidadesService,
  ) {}

  @Get('/todos/:personas')
  async getDiaDisponibles(
    @Param('personas') personas: number,
  ): Promise<Date[]> {
    return await this.DiasDisponiblesService.findDiasNoDisponibles(personas)
  }
}
