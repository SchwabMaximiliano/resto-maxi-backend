import { Controller, Get, Param } from '@nestjs/common'
import { HorariosService } from './horarios.service'

@Controller('/api/horarios')
export class HorariosController {
  constructor(private readonly HorariosService: HorariosService) {}

  @Get('/todos/:date/:personas')
  async getHorarios(
    @Param('date') date: Date,
    @Param('personas') personas: number,
  ): Promise<any> {
    return await this.HorariosService.findHorariosAndDisponibilidades(
      date,
      personas,
    )
  }
}
