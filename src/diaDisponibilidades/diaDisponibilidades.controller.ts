import { Controller, Get, Param } from '@nestjs/common'
import { DiaDisponibilidadesService } from './diaDisponibilidades.service'

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
