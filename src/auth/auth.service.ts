import { ConflictException, HttpException, HttpStatus, Injectable, Logger, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../user/dto/ligin-user.dto';
import { Token } from './entities/token.entity';
import { TokenService } from './jwt.service';

import { User } from 'src/user/entities/user.entity';
import * as speakeasy from 'speakeasy'
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { CreateResetePasswordDto } from './dto/create-resete-pasword.dto';
import { IsEmail } from 'class-validator';
import { CreateGoogleLoginDto } from './dto/create-googleLogin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private userService: UserService,
    private tokenService : TokenService,
    private configService: ConfigService,
  ) {}

  async googleLogin(email: CreateGoogleLoginDto){
    const payload = await this.userService.localLogin(email)
    if (!payload) {
        throw new UnauthorizedException('Invalid credentials')
    }
    
    // console.log("ici mon token:",payload)
    const newToken = new Token()
    const accessToken =await this.tokenService.getAccessToken(payload)
    const refreshToken = await this.tokenService.getRefreshToken(payload)
    newToken.accessToken= accessToken
    newToken.refreshToken= refreshToken
    newToken.userId = payload.id
    await this.tokenRepository.save(newToken)
    const token= await this.tokenService.updateRefreshTokenInUser(newToken, payload.id)
    console.log("oui ici",token)
    return {
      token:token,
      user:payload
    }
  }

  async create(createUserDto: CreateUserDto, idRole:number) {
    const {email, password,name} = createUserDto
    try { 
      const token = await this.tokenService.confirmationToken(createUserDto)  
      return token
    } catch (error) {
      // console.log("toujour des probleme")
      throw new HttpException(error, HttpStatus.BAD_REQUEST)

    }   
  }
  async validateUser(authDto: CreateAuthDto) {
    const {mail, password} = authDto
    try {
      // const user = await this.userService.auth(mail)
    // if (user && user.validatePassword(password,user.password)) { 
    //   return user
    // }
    return null
    } catch (error) {
      throw new NotAcceptableException(error)
    } 
  }
  async login(loginUserDto: LoginUserDto) {
    console.log("data ddddd user",loginUserDto)
    const payload = await this.userService.login(loginUserDto)
    if (!payload) {
        throw new UnauthorizedException('Invalid credentials')
    }
    console.log("user connexion", payload);
    
    const newToken = new Token()
    const accessToken =await this.tokenService.getAccessToken(payload)
    const refreshToken = await this.tokenService.getRefreshToken(payload)
    newToken.accessToken= accessToken
    newToken.refreshToken= refreshToken
    newToken.userId = payload.id
    const token= await this.tokenService.updateRefreshTokenInUser(newToken, payload.id)
    // console.log("ici mon token:",{token:token,user:payload})
    return {token:token,user:payload}
  }


  async mailConfirmation(token:string){
    try {
      const user =  await this.tokenService.verifyToken(token)
      const result =  await this.userService.create(user)
      return result
    } catch (error) {
      console.log("erruooscdvf=",error);
      
      throw new ExceptionsHandler(error);
    }
  }

  async localLogout(userId: User): Promise<User> {
  try {


    const user = await this.userService.findOne(userId.id);

  const token  = await this.tokenService.findOne(userId.id)
  
  // if (!token) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  token.refreshToken = 'null';
  token.accessToken= 'null';

  await this.tokenService.delete(token);
  console.log("le token est ici",userId);
  return user
  } catch (error) {
    throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
  
  }

  async resetPasswordDemand( userMail: string){
    try {
      const users = await this.userService.findOneByEmail(userMail)
      if(!users) throw new NotFoundException('user not found')
      const code = speakeasy.totp({
        secret: this.configService.get('RESETE_PASSWORD_CODE'),
        digits:5,
        step: 60*15,
        encoding:'base32'
      })
      const url = this.configService.get('RESETE_PASSWORD_URL')
     
      return {
        code: code,
        urlResetPassword: url
      }
    } catch (error) {
      throw new HttpException(error,HttpStatus.NOT_FOUND)
    }
  }

  async resetPasswordComfirmation(resetePasswordDto:CreateResetePasswordDto){
    try {
      const user = await this.userService.findOneByEmail(resetePasswordDto.email)
      if(!user)throw new NotAcceptableException('User not fund')
      const match =  speakeasy.totp.verify({
        secret: this.configService.get('RESETE_PASSWORD_CODE'),
        token:resetePasswordDto.code,
        digits:5,
        step: 60*15,
        encoding:'base32'
      })
      if(!match) throw new UnauthorizedException('Invalid/expired token')
      const hashpass= await user.passwordHash(resetePasswordDto.password)
      await this.userService.update(user.id,{password:hashpass})
      return  {data:"updated success"}
    } catch (error) {
      throw new HttpException(error,HttpStatus.NOT_FOUND)
    }
  }
}