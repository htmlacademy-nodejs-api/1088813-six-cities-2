import {UserType} from '../enums/index.js';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  password?: string;
  type?: UserType,
}
