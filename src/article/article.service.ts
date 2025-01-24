import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository:Repository<Article>,
  ) {}
  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll(user) {

    return await this.articleRepository.find()
   
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: {
        id : id
      }
    })
    return article
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
