import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PermissionService } from 'src/user/permission.service';
import { RoleService } from 'src/user/role.service';
import { Permission } from 'src/user/entities/permission.entity';
import { Role } from 'src/user/entities/role.entity';
import { EntityLoader } from 'src/casl/casl-ability.factory/entity-loader.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Article,Permission,Role
    ]),
    
  ],
  controllers: [ArticleController],
  providers: [ArticleService,CaslAbilityFactory, PermissionService,RoleService,EntityLoader]
})
export class ArticleModule {}
