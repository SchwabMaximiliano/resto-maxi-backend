import { Controller, Get } from '@nestjs/common'
import { MesasService } from './mesas.service'
import { Mesa } from '../schemas/mesa.schema'

@Controller('/api/mesas')
export class MesasController {
  constructor(private readonly MesasService: MesasService) {}

  @Get('/todas')
  async getMesas(): Promise<Mesa[]> {
    return await this.MesasService.findAll()
  }
}
