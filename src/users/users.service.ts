import { Model, ObjectId } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { transporter } from '../helper/mailer'
import * as dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

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

  async findUserByUser(user: string): Promise<any> {
    return await this.userModel.find({ user })
  }

  async findUser(encryptedData: User): Promise<any> {
    //set private key
    const privateKeyFromFile = this.getPivateKey()
    const rsaPrivateKey = {
      key: privateKeyFromFile,
      passphrase: '',
      padding: crypto.constants.RSA_PKCS1_PADDING,
    }

    //decrypt
    const decryptedUser = crypto
      .privateDecrypt(rsaPrivateKey, Buffer.from(encryptedData.user, 'base64'))
      .toString('utf8')

    const decryptedPassword = crypto
      .privateDecrypt(
        rsaPrivateKey,
        Buffer.from(encryptedData.password, 'base64'),
      )
      .toString('utf8')

    const userData = await this.userModel.findOne({ user: decryptedUser })

    if (userData !== null) {
      //hash and compare passwords
      const isMatch = await bcrypt.compare(decryptedPassword, userData.password)
      if (isMatch) {
        return userData
      } else {
        return null
      }
    }
    return userData
  }

  async findUserbyId(id: ObjectId): Promise<User> {
    return this.userModel.findById(id)
  }

  async findUserByEmail(email: String): Promise<User> {
    return this.userModel.findOne({ email: email })
  }
  async saveUser(user: User): Promise<User> {
    const createdUser = new this.userModel(user)
    return createdUser.save()
  }

  async findUserEmailHash(emailStateHash: String): Promise<User> {
    const user = await this.userModel.findOne({ emailStateHash })
    if (user) {
      user.emailState = 'verified'
      await this.saveUser(user)
    }
    return user
  }

  async registerUser(user: User): Promise<User> {
    //apply hash
    user.emailStateHash = crypto
      .randomBytes(21)
      .toString('base64')
      .slice(0, 21)
      .replace('/', '-')
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    const userHash = { ...user, password: hash }
    //save new user
    return await this.saveUser(userHash)
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
