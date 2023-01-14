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
import { UsersService } from './users.service'
import { User } from '../schemas/user.schema'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

@Controller('/api/user')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @Get('/publicKey')
  publicKey(): string {
    return this.UserService.getPublicKey()
  }

  @Post('/login')
  async login(
    @Res() res: Response,
    @Body() encryptedData: User,
  ): Promise<Response> {
    //set private key
    const privateKeyFromFile = this.UserService.getPivateKey()
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
    //console.log(decryptedUser)
    // console.log(decryptedPassword)

    //find user
    const userData = await this.UserService.findUser(decryptedUser)
    //console.log(userData)
    if (userData === null) return res.status(HttpStatus.UNAUTHORIZED).json()
    //hash and compare passwords
    const isMatch = await bcrypt.compare(decryptedPassword, userData.password)

    //console.log(isMatch)
    if (isMatch) {
      return res.status(HttpStatus.OK).json(userData)
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json()
    }
  }

  @Post('/register')
  async register(@Res() res: any, @Body() user: User): Promise<void> {
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
    const success = await this.UserService.saveUser(userHash)
    if (success) {
      await this.UserService.mailVerify(user)
      return res.status(HttpStatus.CREATED).json()
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Get('/confirm/:emailStateHash')
  async confirm(
    @Res() res: any,
    @Param('emailStateHash') emailStateHash: String,
  ): Promise<void> {
    const user = await this.UserService.findUserEmailHash(emailStateHash)
    if (user) {
      user.emailState = 'verified'
      await this.UserService.saveUser(user)
      return res.redirect('http://localhost:3000/email-confirmed')
    }
    return res.redirect('http://localhost:3000/email-error')
  }

  @Post('/recover-pass')
  async recovery(@Res() res: any, @Body() user: User): Promise<void> {
    const userData = await this.UserService.findUserByEmail(user.email)
    await this.UserService.recoverPass(userData)
  }

  @Post('/update-pass')
  async updatePass(@Res() res: any, @Body() user: User): Promise<void> {
    //apply hash
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    //update user
    const userData = await this.UserService.findUser(user.user)
    userData.password = hash
    const success = await this.UserService.saveUser(userData)
    if (success) {
      return res.status(HttpStatus.OK).json()
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }
}
