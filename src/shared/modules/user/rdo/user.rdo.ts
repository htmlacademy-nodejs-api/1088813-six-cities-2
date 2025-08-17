import {Expose, Transform} from 'class-transformer';

export class UserRdo {
  @Expose({name: '_id'})
  @Transform(({value}) => value.toString())
  public id: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public email: string;
}
