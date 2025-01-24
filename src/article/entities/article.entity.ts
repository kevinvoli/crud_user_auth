import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
  @PrimaryGeneratedColumn({type:"int", name: "id"})
  id: number;
  @Column({default:false})
  isPublished: boolean;

  @ManyToOne(()=> User, (author)=>author.article)
  authorId: number;
}
