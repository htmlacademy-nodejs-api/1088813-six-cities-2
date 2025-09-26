import {Expose, Transform} from 'class-transformer';
import {SuggestionEntity} from '../../suggestion/index.js';
import {Types} from 'mongoose';

export class UserRdo {
  @Expose({name: '_id'})
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  public id: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public email: string;

  @Expose()
  public avatar: string;

  @Expose()
  @Transform(({value}) => value?.map((suggestion: SuggestionEntity) => new Types.ObjectId(suggestion._id).toString()))
  public favouriteSuggestions: string[];
}
