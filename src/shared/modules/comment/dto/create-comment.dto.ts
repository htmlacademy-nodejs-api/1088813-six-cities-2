import {IsInt, IsMongoId, IsNotEmpty, Max, Min} from 'class-validator';
import {CreateCommentMessages} from './create-comment.messages.js';
import {Transform} from 'class-transformer';

export class CreateCommentDto {
  @IsNotEmpty({ message: CreateCommentMessages.text.required })
  public text: string;

  public authorId: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: CreateCommentMessages.rating.invalidType })
  @Min(1, { message: CreateCommentMessages.rating.min })
  @Max(5, { message: CreateCommentMessages.rating.max })
  public rating: number;

  @IsMongoId({ message: CreateCommentMessages.suggestionId.invalidId })
  public suggestionId: string;
}
