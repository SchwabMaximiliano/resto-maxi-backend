import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Mesa, MesaDocument } from '../schemas/mesa.schema'
import { RESERVA_CANTIDAD_PERSONAS } from '../../config/config'

@Injectable()
export class MesasService {
  constructor(@InjectModel('Mesa') private mesaModel: Model<MesaDocument>) {}

  async findAll(): Promise<Mesa[]> {
    /*
    // ejecutar una sola vez para guardar las mesas en la bd
    RESERVA_CANTIDAD_PERSONAS.map(async (mesa) => {
      await this.saveMesa(mesa)
    })
    */
    return await this.mesaModel.find().exec()
  }
  async cantidadMesas(personas: number): Promise<number> {
    const mesa = await this.mesaModel.findOne({ personas_nro: personas }).exec()
    return mesa.cant_mesas
  }

  async saveMesa(mesa: Mesa): Promise<Mesa> {
    const createdMesa = new this.mesaModel(mesa)
    return await createdMesa.save()
  }
}
