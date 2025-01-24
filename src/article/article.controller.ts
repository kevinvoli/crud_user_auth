import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Request } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/auth/guards/policies.guard';
import { CheckPolicies } from 'src/auth/guards/policies.decorator';
import { Action } from 'src/user/entities/permission.entity';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}


  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard,PoliciesGuard)
  @CheckPolicies(
    (ability) => ability.can(Action.Create, 'Article'),)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articleService.create(createArticleDto);
  }
 
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard,PoliciesGuard)
  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'Article'),)
  @Get()
  async findAll( @Request() req) {
    console.log("user concted lblblblb", req.user);
    
    return await this.articleService.findAll(req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard,PoliciesGuard)
  @CheckPolicies(
    (ability) => ability.can(Action.Read, 'Article'),)

  @Get(':id')
  async findOne(@Param('id') id: string,  @Request() req) {
    return this.articleService.findOne(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard,PoliciesGuard)
  @CheckPolicies(
    (ability) => ability.can(Action.Update, 'Article'),)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto, @Request() req) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard,PoliciesGuard)
  @CheckPolicies(
    (ability) => ability.can(Action.Delete, 'Article'),)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.articleService.remove(+id);
  }
}
