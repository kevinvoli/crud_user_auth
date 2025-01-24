import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateGoogleLoginDto } from 'src/auth/dto/create-googleLogin.dto';
import { LoginUserDto } from './dto/ligin-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    
  ){}


  async create(createUserDto: CreateUserDto) {
    try {

      const newUser = new  User()
      newUser.password = createUserDto?.password;
      newUser.name = createUserDto.name;
      newUser.prenoms = createUserDto.prenoms;
      newUser.contacts = createUserDto.contacts;
      newUser.email = createUserDto.email
      newUser.isAdmin = createUserDto?.isAdmin;
      newUser.salt = await bcrypt.genSalt();
      const user = await this.usersRepository.save(newUser)
      console.log(user);
      return user
    } catch (error) {
      console.log(error);
      throw new ConflictException(error)
    }
  }

  async findAll() {
    const users = await this.usersRepository.find({
    })
    return users
  }

  async findOne(id: number) {
    try {
      const user= await this.usersRepository.findOne({
        where:{
          id:id
        },
        relations:{
          role:{permissions:true}
          
        }
      })
      delete user.password
      return user;
    } catch (error) {
      console.log("mon erreur",error);
      throw new HttpException(`${error}`, HttpStatus.NOT_FOUND)
    }
  }


  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    let users:  User
    try {
      users= await this.usersRepository.findOne({
      where: {email:email},
      })
      const passwords =await users.passwordHash(password)
      console.log("user pass", await users.validatePassword(passwords, users.password));
      
      if(users && await users.validatePassword(password, users.password)){
        const payload = { email: users.email, id:users.id, name:users.name }   
        return payload
      }
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new NotFoundException(error.message)  
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where:{
          email:email
        },
      })
      return user;
    } catch (error) { 
      throw new ConflictException(error)
    }
   }


  async localLogin(createGoogleLoginDto: CreateGoogleLoginDto) {
    const {email} = createGoogleLoginDto;
    try {
      const users = await this.usersRepository.findOne({
      where: {email:email},
      })
      console.log(users)
      if(!users) throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
      return { email: users.email, id:users.id, name:users.name }  
    } catch (error) {
      throw new NotFoundException(error.message)  
    }
  }


  

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.usersRepository.update(id,updateUserDto)
      return result
    } catch (error) {
      throw new HttpException("echec de la mise a jour", HttpStatus.NOT_FOUND)
    }
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: {id}
    });
    if(!user) throw new NotFoundException('user' );
    await this.usersRepository.delete({id});
    return true
  }
}
