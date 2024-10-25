import {  Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtStrategy } from './strategys/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { Token } from './entities/token.entity';
import { JwtRefreshStrategy } from './strategys/jwt-refresh-strategy';
import { UserController } from '../user/user.controller';
import { Repository } from 'typeorm';
import { TokenService } from './jwt.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User,Token]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600
      }
    })
  ],
  controllers: [
    AuthController,
    UserController
  ],
  providers: [
    AuthService,
    UserService,
    TokenService,
    Repository,   
    JwtService,
    JwtStrategy,
    ConfigService,
    JwtRefreshStrategy,  
  ],

})
export class AuthModule {}
