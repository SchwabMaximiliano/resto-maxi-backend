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
import { EMAIL_CONFIRMED, EMAIL_ERROR } from 'src/config'

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
    return userData !== null
      ? res.status(HttpStatus.OK).json(userData)
      : res.status(HttpStatus.UNAUTHORIZED).json()
  }

  @Post('/register')
  async register(@Res() res: any, @Body() user: User): Promise<void> {
    return (await this.UserService.registerUser(user))
      ? res.status(HttpStatus.CREATED).json()
      : res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Get('/confirm/:emailStateHash')
  async confirm(
    @Res() res: any,
    @Param('emailStateHash') emailStateHash: string,
  ): Promise<User> {
    return (await this.UserService.findUserEmailHash(emailStateHash))
      ? res.redirect(EMAIL_CONFIRMED)
      : res.redirect(EMAIL_ERROR)
  }

  @Post('/recover-pass')
  async recovery(@Res() res: any, @Body() user: User): Promise<void> {
    return (await this.UserService.recoverPass(user))
      ? res.status(HttpStatus.OK).json()
      : res.status(HttpStatus.BAD_REQUEST).json()
  }

  @Post('/update-pass')
  async updatePass(@Res() res: any, @Body() user: User): Promise<void> {
    console.log('controller updatepass')
    return (await this.UserService.updateUser(user))
      ? res.status(HttpStatus.OK).json()
      : res.status(HttpStatus.BAD_REQUEST).json()
  }
}
