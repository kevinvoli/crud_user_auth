import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/user/entities/role.entity';
import { Permission } from 'src/user/entities/permission.entity';
import { PermissionService } from 'src/user/permission.service';
import { RoleService } from 'src/user/role.service';
import { EntityLoader } from './casl-ability.factory/entity-loader.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Role, Permission
    ])
  ],
  providers: [CaslAbilityFactory, PermissionService, RoleService,EntityLoader],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
