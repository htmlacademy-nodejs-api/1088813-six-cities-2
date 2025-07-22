import {UserType} from '../enums/index.js';

export type User = {
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  type?: UserType,
}
