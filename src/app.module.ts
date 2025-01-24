import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { CaslModule } from './casl/casl.module';
import * as Joi from '@hapi/joi';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MYSQL_HOST:Joi.string().required(),
        MYSQL_PORT:Joi.number().required(),
        MYSQL_USER:Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE:Joi.string().required(),
        SERVER_PORT:Joi.number().required()
      })
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ArticleModule,
    CaslModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
