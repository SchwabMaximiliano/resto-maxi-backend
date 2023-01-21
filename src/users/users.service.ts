import { Model, ObjectId } from 'mongoose'
import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { transporter } from '../helper/mailer'
import * as dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { EMAIL_RECOVER, EMAIL_VERIFY } from 'src/config'
import { response } from 'express'
import { EMAIL_CONFIRMED, EMAIL_ERROR } from 'src/config'

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  getPublicKey(): string {
    var base = process.env.PWD
    let publicKey
    try {
      publicKey = fs.readFileSync(base + '../../public_key.pem', 'utf8')
    } catch (error) {
      publicKey = fs.readFileSync(base + '/public_key.pem', 'utf8')
    }
    return publicKey
  }

  getPivateKey(): string {
    var base = process.env.PWD
    let privateKey
    try {
      privateKey = fs.readFileSync(base + '../../private_key.pem', 'utf8')
    } catch (error) {
      privateKey = fs.readFileSync(base + '/private_key.pem', 'utf8')
    }
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
    let isMatch = false
    if (userData !== null)
      //hash and compare passwords
      isMatch = await bcrypt.compare(decryptedPassword, userData.password)

    return isMatch
      ? response.status(HttpStatus.OK).json(userData)
      : response.status(HttpStatus.UNAUTHORIZED)
  }

  async findUserbyId(id: ObjectId): Promise<User> {
    return this.userModel.findById(id)
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email })
  }

  async saveUser(user: User): Promise<User> {
    const createdUser = new this.userModel(user)
    return createdUser.save()
  }

  async updateUser(user: User): Promise<any> {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(user.password, salt)
    return this.userModel.findOneAndUpdate(
      { user: user.user },
      { password: passwordHash },
    )
      ? response.status(HttpStatus.OK)
      : response.status(HttpStatus.BAD_REQUEST)
  }

  async findUserEmailHash(emailStateHash: string): Promise<any> {
    const user = await this.userModel.findOne({ emailStateHash })
    if (user) {
      user.emailState = 'verified'
      await this.saveUser(user)
    }
    return user
      ? response.redirect(EMAIL_CONFIRMED)
      : response.redirect(EMAIL_ERROR)
  }

  async registerUser(user: User): Promise<any> {
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
    const success = await this.saveUser(userHash)
    success && (await this.mailVerify(user))
    return success
      ? response.status(HttpStatus.CREATED)
      : response.status(HttpStatus.BAD_REQUEST)
  }

  async mailVerify(user: User): Promise<void> {
    await transporter.sendMail({
      from: `"Resto Maxi 👻" <${process.env.MAILER_USER}>`, // sender address
      to: user.email, // list of receivers
      subject: 'Verifica tu email ✔', // Subject line
      html: EMAIL_VERIFY.replace('{name}', user.name).replace(
        '{emailStateHash}',
        user.emailStateHash,
      ),
    })
  }

  async recoverPass(user: User): Promise<any> {
    const userData = await this.findUserByEmail(user.email)
    if (userData) {
      await transporter.sendMail({
        from: `"Resto Maxi 👻" <${process.env.MAILER_USER}>`, // sender address
        to: userData.email, // list of receivers
        subject: 'Recuperación de contraseña', // Subject line
        html: EMAIL_RECOVER.replace('{user}', userData.user),
      })
      response.status(HttpStatus.OK)
    }
    response.status(HttpStatus.BAD_REQUEST)
  }
}
