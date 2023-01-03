import { Controller, Get, Post, Res, HttpStatus, Body, Param } from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "./users.service";
import { User } from "../schemas/user.schema";
import * as bcrypt from "bcrypt";
import * as crypto from 'crypto';

@Controller("/api/user")
export class UserController {
  constructor(private readonly UserService: UsersService) {}

  @Post("/login")
  async login(
    @Res() res: Response,
    @Body() encryptedData: User
  ): Promise<void> {

    //set private key
    const privateKeyFromFile = this.UserService.getPivateKey();
    const rsaPrivateKey = {
      key: privateKeyFromFile,
      passphrase: '',
      padding: crypto.constants.RSA_PKCS1_PADDING,
    };
    
    //decrypt
    const decryptedUser = crypto.privateDecrypt(
      rsaPrivateKey,
      Buffer.from(encryptedData.user, 'base64'),
    ).toString('utf8');

    const decryptedPassword = crypto.privateDecrypt(
      rsaPrivateKey,
      Buffer.from(encryptedData.password, 'base64'),
    ).toString('utf8');
  
    //find user
    const userData = await this.UserService.findUser(decryptedUser);
    
    //hash and compare passwords
    const isMatch = await bcrypt.compare(decryptedPassword, userData.password);
    console.log(isMatch)
    if (isMatch) {
      res.status(HttpStatus.OK).json(userData);
    }
    else{
      res.status(HttpStatus.UNAUTHORIZED).json();
    }
  }

  @Post("/register")
  async register(@Res() res: any, @Body() user: User): Promise<void> {
    //apply hash
    user.emailStateHash = crypto.randomBytes(21).toString('base64').slice(0, 21).replace('/', '-');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    const userHash = { ...user, password: hash };
    //save new user
    const data = await this.UserService.saveUser(userHash);
    if (data) {
      await this.UserService.verifyMail(user);
      return res.status(HttpStatus.CREATED).json();
    }
    return res.status(HttpStatus.BAD_REQUEST).json();
    
  }
  
  @Get("/confirm/:emailStateHash")
  async confirm(@Res() res: any, @Param('emailStateHash') emailStateHash: String): Promise<void> {
    const user = await this.UserService.findUserEmailHash(emailStateHash);
    if (user) {
      user.emailState = "verified";
      await this.UserService.saveUser(user);    
      return  res.redirect('http://localhost:3000/email-confirmed');   
    }
    return res.redirect('http://localhost:3000/email-error');
  }

  @Get("/publicKey")
  publicKey(): string {
    return this.UserService.getPublicKey();
  }
}
