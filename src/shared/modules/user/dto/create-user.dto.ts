import {UserType} from '../../../enums/index.js';

export class CreateUserDto {
  public email: string;
  public avatar?: string;
  public firstName: string;
  public lastName: string;
  public password: string;
  public type: UserType;
}
