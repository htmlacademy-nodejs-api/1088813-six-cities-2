import {Expose, Transform, Type} from 'class-transformer';
import {SuggestionRdo} from '../../suggestion/rdo/suggestion.rdo.js';
import {UserRdo} from '../../user/index.js';
import dayjs from 'dayjs';

export class CommentRdo {
  @Expose()
  public text: string;

  @Expose({name: '_id'})
  @Transform(({value}) => value.toString())
  public id: string;

  @Expose()
  @Type(() => SuggestionRdo)
  public suggestion: SuggestionRdo;

  @Expose()
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose({name: 'createdAt'})
  @Transform(({value}) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
  public createDate: string;

  @Expose()
  public rating: number;
}
