import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { transporter } from '../helper/mailer'
import * as dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  getPublicKey(): string {
    var base = process.env.PWD
    const publicKey = fs.readFileSync(base + '../../public_key.pem', 'utf8')

    return publicKey
  }

  getPivateKey(): string {
    var base = process.env.PWD
    const privateKey = fs.readFileSync(base + '../../private_key.pem', 'utf8')
    return privateKey
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findUser(user: string): Promise<User> {
    return this.userModel.findOne({ user: user })
  }

  async findUserByEmail(email: String): Promise<User> {
    return this.userModel.findOne({ email: email })
  }

  async findUserEmailHash(emailStateHash: String): Promise<User> {
    return this.userModel.findOne({ emailStateHash: emailStateHash })
  }

  async saveUser(user: User): Promise<User> {
    const createdUser = new this.userModel(user)
    return createdUser.save()
  }

  async mailVerify(user: User): Promise<void> {
    await transporter.sendMail({
      from: `"Resto Maxi 👻" <${process.env.MAILER_USER}>`, // sender address
      to: user.email, // list of receivers
      subject: 'Verifica tu email ✔', // Subject line
      html: `
        <p><b>Hola ${user.name} Clickea el siguiente enlace para validar tu email</b></p>
        <a href="http://localhost:4000/api/user/confirm/${user.emailStateHash}">Verificar Email</a>
      `,
    })
  }

  async recoverPass(user: User): Promise<void> {
    await transporter.sendMail({
      from: `"Resto Maxi 👻" <${process.env.MAILER_USER}>`, // sender address
      to: user.email, // list of receivers
      subject: 'Recuperación de contraseña', // Subject line
      html: `
        <p><b>Clickea el siguiente enlace para reestablecer tu contraseña</b></p>
        <a href="http://localhost:3000/recoverpass-enterpass/${user.user}">Reestablecer contraseña</a>
      `,
    })
  }
}
