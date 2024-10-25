import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseInterceptors, UseGuards, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('register')
  // create(@Body() createUserDto: CreateUserDto) {

  //   const user = this.userService.create(createUserDto);
  //   return user
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request()req) {
    const user = await this.userService.findAll();
    return user
  }


  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {

    const user  = await this.userService.findOne(+id);
    return this.userService.findOne(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findOne(+id)
    return await this.userService.update(user.id, updateUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
