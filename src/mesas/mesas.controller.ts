import { Controller, Get } from '@nestjs/common'
import { MesasService } from './mesas.service'
import { Mesa } from '../schemas/mesa.schema'
import { RESERVA_CANTIDAD_PERSONAS } from '../../config/config'

@Controller('/api/mesas')
export class MesasController {
  constructor(private readonly MesasService: MesasService) {}

  @Get('/todas')
  async getMesas(): Promise<Mesa[]> {
    /*
    // ejecutar una sola vez para guardar las mesas en la bd
    RESERVA_CANTIDAD_PERSONAS.map(async (mesa) => {
      await this.MesasService.saveMesa(mesa)
    })
    */

    return await this.MesasService.findAll()
  }
}
