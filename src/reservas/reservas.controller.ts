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
import { DisponibilidadesService } from '../disponibilidades/disponibilidades.service'
import { Disponibilidad } from '../schemas/disponibilidad.schema'
import { MesasService } from '../mesas/mesas.service'
import { Mesa } from '../schemas/mesa.schema'
import { HorariosService } from 'src/horarios/horarios.service'
import { DiaDisponibilidad } from 'src/schemas/diaDisponibilidad.schema'
import { DiaDisponibilidadesService } from 'src/diaDisponibilidades/diaDisponibilidades.service'

@Controller('/api/reservas')
export class ReservasController {
  constructor(
    private readonly ReservasService: ReservasService,
    private readonly DisponibilidadesService: DisponibilidadesService,
    private readonly MesasService: MesasService,
    private readonly HorariosService: HorariosService,
    private readonly DiaDisponibilidadService: DiaDisponibilidadesService,
  ) {}

  @Post('/nueva-reserva')
  async register(@Res() res: any, @Body() reserva: Reserva): Promise<void> {
    // guardamos la reserva
    const success = await this.ReservasService.saveReserva(reserva)

    // actualizamos disponibilidad de horarios
    const cantidad_mesas = await this.MesasService.cantidadMesas(
      reserva.personas,
    )
    const reservas_guardadas_mesa = await (
      await this.ReservasService.findReserva(reserva)
    )?.length

    if (reservas_guardadas_mesa && reservas_guardadas_mesa >= cantidad_mesas) {
      await this.DisponibilidadesService.saveDisponibilidad({
        date: reserva.date,
        hora: reserva.hora,
        personas: reserva.personas,
      })
    }

    // actualizamos disponibilidad de dias
    const cantidad_horarios = (await this.HorariosService.findAll()).length
    const horarios_no_disponibles = (
      await this.DisponibilidadesService.findHorariosNoDisponibles(reserva)
    )?.length

    if (
      horarios_no_disponibles &&
      horarios_no_disponibles >= cantidad_horarios
    ) {
      await this.DiaDisponibilidadService.saveDia({
        date: reserva.date,
        personas: reserva.personas,
      })
    }
    if (success) {
      return res.status(HttpStatus.CREATED).json()
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Get('/todas')
  async getReservas(): Promise<Reserva[]> {
    return await this.ReservasService.findAll()
  }

  @Get('/horarios-no-disponibles/:data')
  async getHorariosNoDisponibles(@Param('data') data: any): Promise<string[]> {
    return await this.DisponibilidadesService.findHorariosNoDisponibles(data)
  }
}
