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
    const userData = await this.UserService.findUser(encryptedData)

    if (userData !== null) {
      return res.status(HttpStatus.OK).json(userData)
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json()
    }
  }

  @Post('/register')
  async register(@Res() res: any, @Body() user: User): Promise<void> {
    const success = await this.UserService.registerUser(user)
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
  ): Promise<User> {
    const user = await this.UserService.findUserEmailHash(emailStateHash)
    if (user) {
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
    const success = await this.UserService.saveUser(user)
    if (success) {
      return res.status(HttpStatus.OK).json()
    }
    return res.status(HttpStatus.BAD_REQUEST).json()
  }
}
