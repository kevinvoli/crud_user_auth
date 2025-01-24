import { IsNotEmpty, isNotEmpty } from "class-validator";


export class CreateArticleDto {

  @IsNotEmpty()
  isPublished : boolean | null
}
