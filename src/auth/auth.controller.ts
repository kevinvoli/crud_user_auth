import { Controller,
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Logger, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  ClassSerializerInterceptor, 
  HttpStatus, 
  Req, 
  Res, 
  Options, 
  HttpException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/ligin-user.dto';

import { User } from '../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { PickType } from '@nestjs/mapped-types';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CreateResetePasswordDto } from './dto/create-resete-pasword.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateUserDto, idRole:number=1) {
    
    const users= await this.authService.create(createAuthDto, idRole);
    console.log('moi aaussi',createAuthDto);

    return users
  }
  // @UseGuards(AuthGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto , @Request() req, @Res({passthrough:true})response: Response) {
    const token= await this.authService.login(loginUserDto)
    response.cookie('jwt',token,{httpOnly:true})
    // console.log(token); 
    return token
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request()req, @Res({passthrough:true}) respons:Response){
    respons.clearCookie('jwt')
    
    const result= await this.authService.localLogout(req.user)
    console.log("cococococococococococococococococococococo", result);
    return result
  }


  @Get('confirmation/:token')
  async  mailconfirmation(@Param('token')token:string){
    try {
      console.log(token);
      const confirmation = await this.authService.mailConfirmation(token)
      console.log(confirmation);
      return 'succes to register'
    } catch (error) {
      throw new Error(error)
    }
   
  }

  @Post('resete-password')
  async resetePassword(@Body()user:UpdateUserDto, @Res({passthrough:true}) respons:Response){
    respons.clearCookie('jwt')
    console.log("cococococococococococococococococococococo");
    const result= await this.authService.resetPasswordDemand(user.email)
    return result
  }

  @Post('reset-password-confirmation')
  async resetePasswordConfirm(@Body()code:CreateResetePasswordDto, @Res({passthrough:true}) respons:Response){
    respons.clearCookie('jwt')
    console.log("cococococococococococococococococococococo");
    
    const result= await this.authService.resetPasswordComfirmation(code)
    console.log("cococococococococococococococococococococo", result);

    return result
  }

  @Delete('delete')
  async deleteAccount(){
    return "succes to delete"
  }
}