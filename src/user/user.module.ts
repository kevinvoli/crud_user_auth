import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { PermissionService } from './permission.service';
import { RoleService } from './role.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      User, Role, Permission
    ])
  ],
  controllers: [UserController],
  providers: [UserService, PermissionService, RoleService]
})
export class UserModule {}
