import { Controller, Get, Post, Body, Param } from '@nestjs/common'
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
  async login(@Body() encryptedData: User): Promise<any> {
    return await this.UserService.findUser(encryptedData)
  }

  @Post('/register')
  async register(@Body() user: User): Promise<any> {
    return await this.UserService.registerUser(user)
  }

  @Get('/confirm/:emailStateHash')
  async confirm(
    @Param('emailStateHash') emailStateHash: string,
  ): Promise<User> {
    return await this.UserService.findUserEmailHash(emailStateHash)
  }

  @Post('/recover-pass')
  async recovery(@Body() user: User): Promise<any> {
    return await this.UserService.recoverPass(user)
  }

  @Post('/update-pass')
  async updatePass(@Body() user: User): Promise<void> {
    console.log('controller updatepass')
    return await this.UserService.updateUser(user)
  }
}
