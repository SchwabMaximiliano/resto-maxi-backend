import {
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common'
import { Response } from 'express'
import { ReservasService } from './reservas.service'
import { Reserva } from '../schemas/reserva.schema'

@Controller('/api/reservas')
export class ReservasController {
  constructor(private readonly ReservasService: ReservasService) {}

  @Post('/nueva-reserva')
  async register(@Res() res: any, @Body() reserva: Reserva): Promise<void> {
    const success = await this.ReservasService.saveReserva(reserva)

    if (success) {
      return res.status(HttpStatus.CREATED).json()
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Get('/todas')
  async getReservas(): Promise<Reserva[]> {
    return await this.ReservasService.findAll()
  }
}
