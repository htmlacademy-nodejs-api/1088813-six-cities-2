import {Expose, Type} from 'class-transformer';
import {UserRdo} from './user.rdo.js';

export class LoggedUserRdo {
  @Expose()
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public token: string;
}
