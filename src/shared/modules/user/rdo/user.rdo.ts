import {Expose, Transform} from 'class-transformer';

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
  public favouriteSuggestions: unknown[];
}
