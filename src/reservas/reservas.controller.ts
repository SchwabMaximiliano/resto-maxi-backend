import {
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common'
import { ReservasService } from './reservas.service'
import { Reserva } from '../schemas/reserva.schema'
import { DisponibilidadesService } from '../disponibilidades/disponibilidades.service'

@Controller('/api/reservas')
export class ReservasController {
  constructor(
    private readonly ReservasService: ReservasService,
    private readonly DisponibilidadesService: DisponibilidadesService,
  ) {}

  @Post('/nueva-reserva')
  async register(@Res() res: any, @Body() reserva: Reserva): Promise<void> {
    return (await this.ReservasService.saveReserva(reserva))
      ? res.status(HttpStatus.CREATED).json()
      : res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Get('/todas')
  async getReservas(): Promise<Reserva[]> {
    return await this.ReservasService.findAll()
  }

  @Get('/horarios-no-disponibles/:data')
  async getHorariosNoDisponibles(@Param('data') data: any): Promise<string[]> {
    return await this.DisponibilidadesService.findHorariosNoDisponibles(data)
  }

  @Get('/todas/:user')
  async getReservasUser(@Param('user') user: any): Promise<Object> {
    return await this.ReservasService.findReservasUser(user)
  }
}
