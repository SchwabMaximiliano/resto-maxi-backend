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
import { DisponibilidadesService } from './disponibilidades.service'
import { Disponibilidad } from '../schemas/disponibilidad.schema'

@Controller('/api/disponibilidades')
export class DisponibilidadesController {
  constructor(
    private readonly DisponibilidadesService: DisponibilidadesService,
  ) {}

  @Get('/todas')
  async getDisponibilidades(): Promise<Disponibilidad[]> {
    return await this.DisponibilidadesService.findAll()
  }
}
