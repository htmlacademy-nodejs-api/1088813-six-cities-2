import {BaseUserException} from './base-user.exception.js';
import {StatusCodes} from 'http-status-codes';

export class IncorrectPasswordException extends BaseUserException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect user name or password');
  }
}
